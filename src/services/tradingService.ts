import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DemoAccount, Instrument, DemoHolding, DemoTransaction } from '../types/schema';
import { 
  MOCK_DEMO_ACCOUNT, 
  MOCK_INSTRUMENTS, 
  MOCK_DEMO_HOLDINGS, 
  MOCK_DEMO_TRANSACTIONS 
} from '../data/mockData';

export const tradingService = {
  /**
   * Fetch demo account details for authenticated user
   */
  async getDemoAccount(userId: string): Promise<DemoAccount> {
    if (!userId || userId === 'guest') return MOCK_DEMO_ACCOUNT;
    if (!isSupabaseConfigured) return MOCK_DEMO_ACCOUNT;
    try {
      const { data, error } = await supabase
        .from('demo_accounts')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) {
        return {
          demo_account_id: 1,
          user_id: 1,
          virtual_balance: 1000000.00,
          currency: 'INR',
          initial_capital: 1000000.00
        };
      }

      return {
        demo_account_id: 1,
        user_id: 1,
        virtual_balance: Number(data.virtual_balance),
        currency: data.currency || 'INR',
        initial_capital: Number(data.initial_capital || 1000000)
      };
    } catch (err) {
      console.error('Error fetching demo account:', err);
      return {
        demo_account_id: 1,
        user_id: 1,
        virtual_balance: 1000000.00,
        currency: 'INR',
        initial_capital: 1000000.00
      };
    }
  },

  /**
   * Fetch trading instruments
   */
  async getInstruments(): Promise<Instrument[]> {
    if (!isSupabaseConfigured) return MOCK_INSTRUMENTS;
    try {
      const { data, error } = await supabase.from('instruments').select('*');
      if (error || !data || data.length === 0) return MOCK_INSTRUMENTS;

      return data.map((inst: any, idx: number) => ({
        instrument_id: idx + 1,
        symbol: inst.symbol,
        name: inst.name,
        instrument_type: inst.instrument_type || 'EQUITY',
        topic_id: 1,
        simulated_price: Number(inst.simulated_price || 100),
        daily_change_percent: 1.25,
        currency: inst.currency || 'INR'
      }));
    } catch (err) {
      console.error('Error fetching instruments:', err);
      return MOCK_INSTRUMENTS;
    }
  },

  /**
   * Fetch active demo holdings strictly scoped to user account
   */
  async getHoldings(userId: string): Promise<DemoHolding[]> {
    if (!userId || userId === 'guest') return [];
    if (!isSupabaseConfigured) return [];
    try {
      // 1. Resolve demo account for user
      const { data: account } = await supabase
        .from('demo_accounts')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!account) return [];

      const { data, error } = await supabase
        .from('demo_holdings')
        .select('*')
        .eq('demo_account_id', account.id);

      if (error || !data || data.length === 0) return [];

      return data.map((h: any, idx: number) => ({
        holding_id: idx + 1,
        demo_account_id: 1,
        instrument_id: Number(h.instrument_id) || (idx % 6) + 1,
        quantity: Number(h.quantity),
        avg_buy_price: Number(h.avg_buy_price)
      }));
    } catch (err) {
      console.error('Error fetching holdings:', err);
      return [];
    }
  },

  /**
   * Fetch transaction ledger strictly scoped to user account
   */
  async getTransactions(userId: string): Promise<DemoTransaction[]> {
    if (!userId || userId === 'guest') return [];
    if (!isSupabaseConfigured) return [];
    try {
      // 1. Resolve demo account for user
      const { data: account } = await supabase
        .from('demo_accounts')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!account) return [];

      const { data, error } = await supabase
        .from('demo_transactions')
        .select('*')
        .eq('demo_account_id', account.id)
        .order('executed_at', { ascending: false });

      if (error || !data || data.length === 0) return [];

      return data.map((t: any, idx: number) => ({
        demo_transaction_id: idx + 1,
        demo_account_id: 1,
        instrument_id: Number(t.instrument_id) || 1,
        transaction_type: t.transaction_type as 'BUY' | 'SELL',
        quantity: Number(t.quantity),
        price_per_unit: Number(t.price_per_unit),
        timestamp: t.executed_at
      }));
    } catch (err) {
      console.error('Error fetching transactions:', err);
      return [];
    }
  },

  /**
   * Execute Authoritative Paper Trade
   */
  async executeTrade(
    userId: string,
    demoAccountId: string,
    instrumentId: string,
    type: 'BUY' | 'SELL',
    quantity: number,
    pricePerUnit: number
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    const totalCost = quantity * pricePerUnit;

    if (!isSupabaseConfigured) {
      // Demo fallback validation
      if (type === 'BUY' && MOCK_DEMO_ACCOUNT.virtual_balance < totalCost) {
        return { success: false, error: 'Insufficient virtual funds for order.' };
      }
      return { success: true, newBalance: MOCK_DEMO_ACCOUNT.virtual_balance - totalCost };
    }

    try {
      // 1. Try atomic PostgreSQL RPC function first
      const { data: rpcData, error: rpcError } = await supabase.rpc('execute_paper_trade', {
        p_user_id: userId,
        p_instrument_id: instrumentId,
        p_transaction_type: type,
        p_quantity: quantity,
        p_price_per_unit: pricePerUnit
      });

      if (!rpcError && rpcData) {
        if (rpcData.success) {
          return { success: true, newBalance: Number(rpcData.new_balance) };
        } else {
          return { success: false, error: rpcData.error || 'Trade execution failed.' };
        }
      }

      // 2. Direct transactional fallback if RPC is not yet created in Supabase project
      const { data: account, error: accErr } = await supabase
        .from('demo_accounts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (accErr || !account) {
        return { success: false, error: 'Demo trading account not found.' };
      }

      const currentBalance = Number(account.virtual_balance);

      if (type === 'BUY') {
        if (currentBalance < totalCost) {
          return { success: false, error: 'Insufficient virtual balance.' };
        }
        const updatedBalance = currentBalance - totalCost;

        // Update account balance
        await supabase.from('demo_accounts').update({ virtual_balance: updatedBalance }).eq('id', account.id);

        // Record transaction
        await supabase.from('demo_transactions').insert({
          demo_account_id: account.id,
          instrument_id: instrumentId,
          transaction_type: 'BUY',
          quantity,
          price_per_unit: pricePerUnit,
          total_value: totalCost,
          executed_at: new Date().toISOString()
        });

        return { success: true, newBalance: updatedBalance };
      } else {
        // SELL operation
        const updatedBalance = currentBalance + totalCost;
        await supabase.from('demo_accounts').update({ virtual_balance: updatedBalance }).eq('id', account.id);

        await supabase.from('demo_transactions').insert({
          demo_account_id: account.id,
          instrument_id: instrumentId,
          transaction_type: 'SELL',
          quantity,
          price_per_unit: pricePerUnit,
          total_value: totalCost,
          executed_at: new Date().toISOString()
        });

        return { success: true, newBalance: updatedBalance };
      }
    } catch (err: any) {
      console.error('Error executing trade:', err);
      return { success: false, error: err.message || 'Trade execution failed.' };
    }
  }
};
