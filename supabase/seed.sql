-- ============================================================================
-- FINANCEX - AUTHORITATIVE PRODUCTION DATA SEED SCRIPT
-- Completely Idempotent (Safe to run multiple times)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. KNOWLEDGE LEVELS
-- ----------------------------------------------------------------------------
INSERT INTO public.knowledge_levels (id, level_name, min_score, max_score, badge_color)
VALUES
  ('00000001-0000-0000-0000-000000000001', 'Novice Saver', 0, 250, '#94A3B8'),
  ('00000001-0000-0000-0000-000000000002', 'Market Explorer', 251, 600, '#06B6D4'),
  ('00000001-0000-0000-0000-000000000003', 'Derivative Analyst', 601, 1100, '#00E599'),
  ('00000001-0000-0000-0000-000000000004', 'Portfolio Strategist', 1101, 1800, '#A855F7'),
  ('00000001-0000-0000-0000-000000000005', 'Chartered Master', 1801, 3000, '#FF2E7E')
ON CONFLICT (level_name) DO UPDATE SET
  min_score = EXCLUDED.min_score,
  max_score = EXCLUDED.max_score,
  badge_color = EXCLUDED.badge_color;

-- ----------------------------------------------------------------------------
-- 2. TOPICS
-- ----------------------------------------------------------------------------
INSERT INTO public.topics (id, topic_name, difficulty_level, icon, description)
VALUES
  ('00000002-0000-0000-0000-000000000001', 'Introduction to Securities Markets', 'BEGINNER', 'Compass', 'Primary and secondary markets, stock exchanges, depositories, and SEBI regulatory architecture.'),
  ('00000002-0000-0000-0000-000000000002', 'Equity Derivatives & Futures Pricing', 'INTERMEDIATE', 'TrendingUp', 'Forward contracts, cash-and-carry arbitrage, cost of carry, basis dynamics, and open interest.'),
  ('00000002-0000-0000-0000-000000000003', 'Options Strategies & The Greeks', 'ADVANCED', 'Layers', 'Black-Scholes-Merton math, Delta, Gamma, Theta, Vega, Rho, Bull Call Spreads, Straddles, and Iron Condors.'),
  ('00000002-0000-0000-0000-000000000004', 'Fixed Income, Bonds & Duration', 'INTERMEDIATE', 'Percent', 'Bond pricing equations, YTM, Macaulay Duration, Modified Duration, and convexity immunization.'),
  ('00000002-0000-0000-0000-000000000005', 'SEBI Regulations & Code of Conduct', 'BEGINNER', 'Scale', 'Insider trading prevention, Takeover Code, PFUTP rules, research analyst disclosures, and ethics.'),
  ('00000002-0000-0000-0000-000000000006', 'Fundamental Valuation & Financial Ratios', 'ADVANCED', 'FileSpreadsheet', 'Discounted Cash Flow (DCF), WACC, P/E, EV/EBITDA, DuPont Analysis, and financial statements.')
ON CONFLICT (topic_name) DO UPDATE SET
  difficulty_level = EXCLUDED.difficulty_level,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description;

-- ----------------------------------------------------------------------------
-- 3. CERTIFICATIONS
-- ----------------------------------------------------------------------------
INSERT INTO public.certifications (id, certification_name, governing_body, validity_years, prerequisites, badge_icon, summary)
VALUES
  ('00000003-0000-0000-0000-000000000001', 'NISM-Series-VIII: Equity Derivatives Certification', 'NISM', 3, 'Basic understanding of Indian equity and derivatives markets', 'Award', 'The benchmark regulatory certification for derivative dealers, risk managers, and equity strategists across Indian stock exchanges.'),
  ('00000003-0000-0000-0000-000000000002', 'NISM-Series-XV: Research Analyst Certification', 'NISM', 3, 'Financial statement analysis & valuation principles', 'FileText', 'Mandatory certification required under SEBI (Research Analysts) Regulations, 2014 for equity research professionals.'),
  ('00000003-0000-0000-0000-000000000003', 'NCFM: Debt & Fixed Income Markets Module', 'NCFM', 5, 'Bond math & interest rate fundamentals', 'Percent', 'National Stock Exchange certification testing practical competence in sovereign securities, money market instruments, and credit spreads.'),
  ('00000003-0000-0000-0000-000000000004', 'FinanceX Certified Financial Strategist (FCFS)', 'FINANCEX ACADEMY', 10, 'Completion of 3 Core Modules + Virtual Trading Sandbox Milestone', 'GraduationCap', 'Distinguished industry badge validating practical market simulation prowess, risk governance, and regulatory mastery.')
ON CONFLICT (certification_name) DO UPDATE SET
  governing_body = EXCLUDED.governing_body,
  validity_years = EXCLUDED.validity_years,
  prerequisites = EXCLUDED.prerequisites,
  badge_icon = EXCLUDED.badge_icon,
  summary = EXCLUDED.summary;

-- ----------------------------------------------------------------------------
-- 4. ACHIEVEMENTS
-- ----------------------------------------------------------------------------
INSERT INTO public.achievements (id, achievement_name, description, category, xp_reward)
VALUES
  ('00000010-0000-0000-0000-000000000001', '7-Day Market Streak', 'Maintained a 7-day continuous learning streak', 'STREAK', 150),
  ('00000010-0000-0000-0000-000000000002', 'Option Greek Guru', 'Mastered Delta, Gamma, Theta, and Vega with 100% quiz accuracy', 'LEARNING', 200),
  ('00000010-0000-0000-0000-000000000003', 'First Virtual Trade', 'Executed your first paper trade order in Practice Lab', 'TRADING', 100),
  ('00000010-0000-0000-0000-000000000004', 'NISM Mock Champion', 'Scored >85% on NISM Series VIII full-length mock exam', 'EXAM', 350),
  ('00000010-0000-0000-0000-000000000005', 'Community Contributor', 'Shared an accepted answer in the financial discussion forum', 'COMMUNITY', 120),
  ('00000010-0000-0000-0000-000000000006', 'Risk Manager Elite', 'Constructed a delta-neutral options straddle in the simulator', 'TRADING', 250),
  ('00000010-0000-0000-0000-000000000007', 'Money Evolution Pioneer', 'Completed all 9 chapters of the Evolution of Money story', 'LEARNING', 180),
  ('00000010-0000-0000-0000-000000000008', '14-Day Iron Discipline', 'Studied every day for 2 consecutive weeks', 'STREAK', 300)
ON CONFLICT (achievement_name) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  xp_reward = EXCLUDED.xp_reward;

-- ----------------------------------------------------------------------------
-- 5. COURSES
-- ----------------------------------------------------------------------------
INSERT INTO public.courses (id, course_title, description, price, certification_id, level, author, image_url, estimated_hours)
VALUES
  ('00000004-0000-0000-0000-000000000001', 'NISM Series VIII: Equity Derivatives Certification Masterclass', 'Comprehensive preparation for the NISM-Series-VIII: Equity Derivatives Certification Examination recognized by SEBI.', 0.00, '00000003-0000-0000-0000-000000000001', 'INTERMEDIATE', 'Dr. Arvind Swaminathan, CFA', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80', 14),
  ('00000004-0000-0000-0000-000000000002', 'Fixed Income & Debt Securities Analysis', 'Master sovereign yield curves, corporate bonds, duration risk, and interest rate sensitivity.', 0.00, '00000003-0000-0000-0000-000000000003', 'INTERMEDIATE', 'Pooja Verma, FRM', 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80', 10),
  ('00000004-0000-0000-0000-000000000003', 'NISM Series XV: Research Analyst Certification', 'Prepare to publish institutional equity research with rigorous valuation methods and regulatory compliance.', 0.00, '00000003-0000-0000-0000-000000000002', 'ADVANCED', 'Rajesh Mehta, Senior Research Analyst', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80', 12),
  ('00000004-0000-0000-0000-000000000004', 'Financial Fundamentals: The Evolution of Money & Markets', 'From ancient barter and minted bullion to fractional reserve banking and algorithmic capital markets.', 0.00, '00000003-0000-0000-0000-000000000004', 'BEGINNER', 'FinanceX Core Editorial', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', 6)
ON CONFLICT (course_title) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  certification_id = EXCLUDED.certification_id,
  level = EXCLUDED.level,
  author = EXCLUDED.author,
  image_url = EXCLUDED.image_url,
  estimated_hours = EXCLUDED.estimated_hours;

-- ----------------------------------------------------------------------------
-- 6. INSTRUMENTS
-- ----------------------------------------------------------------------------
INSERT INTO public.instruments (id, symbol, name, instrument_type, topic_id, currency, simulated_price, is_active)
VALUES
  ('00000011-0000-0000-0000-000000000001', 'RELIANCE', 'Reliance Industries Ltd', 'EQUITY', '00000002-0000-0000-0000-000000000001', 'INR', 2984.50, TRUE),
  ('00000011-0000-0000-0000-000000000002', 'INFY', 'Infosys Limited', 'EQUITY', '00000002-0000-0000-0000-000000000001', 'INR', 1845.20, TRUE),
  ('00000011-0000-0000-0000-000000000003', 'HDFCBANK', 'HDFC Bank Ltd', 'EQUITY', '00000002-0000-0000-0000-000000000001', 'INR', 1672.00, TRUE),
  ('00000011-0000-0000-0000-000000000004', 'GOI-7.18-2033', 'Government of India 7.18% 2033 10Y Benchmark', 'BOND', '00000002-0000-0000-0000-000000000004', 'INR', 100.85, TRUE),
  ('00000011-0000-0000-0000-000000000005', 'PPFCAP-DIR', 'Parag Parikh Flexi Cap Fund - Direct Growth', 'MUTUAL_FUND', '00000002-0000-0000-0000-000000000001', 'INR', 84.62, TRUE)
ON CONFLICT (symbol) DO UPDATE SET
  name = EXCLUDED.name,
  instrument_type = EXCLUDED.instrument_type,
  topic_id = EXCLUDED.topic_id,
  currency = EXCLUDED.currency,
  simulated_price = EXCLUDED.simulated_price,
  is_active = EXCLUDED.is_active;

-- ----------------------------------------------------------------------------
-- 7. QUESTIONS (24 Authoritative Question Bank Records)
-- ----------------------------------------------------------------------------
INSERT INTO public.questions (id, topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation)
VALUES
  (
    '00000007-0000-0000-0000-000000000001',
    '00000002-0000-0000-0000-000000000003',
    'If a Call option has a Delta of 0.60 and the underlying stock price increases by ₹10, what is the theoretical expected change in the option premium?',
    'Increases by ₹10.00', 'Increases by ₹6.00', 'Decreases by ₹6.00', 'Increases by ₹0.60',
    'B', 'EASY',
    'Delta (Δ) = Change in Option Price / Change in Stock Price. Therefore, Change in Option Price = 0.60 × ₹10 = +₹6.00.'
  ),
  (
    '00000007-0000-0000-0000-000000000002',
    '00000002-0000-0000-0000-000000000003',
    'Which Option Greek reaches its maximum absolute value for At-The-Money (ATM) options approaching expiration?',
    'Delta', 'Vega', 'Gamma', 'Rho',
    'C', 'MEDIUM',
    'Gamma represents the rate of change of Delta. For ATM options close to expiry, a tiny move in spot price switches the option rapidly between ITM and OTM, causing Gamma to spike.'
  ),
  (
    '00000007-0000-0000-0000-000000000003',
    '00000002-0000-0000-0000-000000000003',
    'An investor buys a Nifty 24,000 Call and sells a Nifty 24,500 Call for the same expiry month. What is this multi-leg strategy called?',
    'Bear Put Spread', 'Bull Call Spread', 'Long Straddle', 'Iron Condor',
    'B', 'EASY',
    'A Bull Call Spread consists of buying an In-The-Money/At-The-Money Call and financing part of the premium by selling a higher Strike Out-Of-The-Money Call.'
  ),
  (
    '00000007-0000-0000-0000-000000000004',
    '00000002-0000-0000-0000-000000000003',
    'What happens to the Vega of an option as time to expiration approaches zero (T → 0)?',
    'Vega increases exponentially', 'Vega approaches zero', 'Vega remains constant at 1.0', 'Vega equals the Delta',
    'B', 'MEDIUM',
    'With almost no time remaining, changes in implied volatility have little effect on the option value because the final payoff is determined immediately by the spot price.'
  ),
  (
    '00000007-0000-0000-0000-000000000005',
    '00000002-0000-0000-0000-000000000003',
    'Which party in an option contract always has negative Theta (suffers from time decay)?',
    'Option Seller / Writer', 'Option Buyer / Holder', 'Arbitrageur', 'Market Maker',
    'B', 'EASY',
    'Option buyers pay a premium that contains extrinsic (time) value. Each passing day erodes this time value, making Theta negative for long option positions.'
  ),
  (
    '00000007-0000-0000-0000-000000000006',
    '00000002-0000-0000-0000-000000000004',
    'If interest rates in the economy rise by 100 basis points, what happens to the market price of an existing fixed-rate 10-year Government Bond?',
    'Bond price rises', 'Bond price falls', 'Bond price stays identical', 'Coupon rate decreases',
    'B', 'EASY',
    'Bond prices and interest rates share an inverse relationship. When prevailing market yields increase, existing lower-coupon bonds become less attractive and fall in price until their yield matches the market.'
  ),
  (
    '00000007-0000-0000-0000-000000000007',
    '00000002-0000-0000-0000-000000000005',
    'Under SEBI regulations, what is the mandatory cooling-off period required before an entity with unpublished price-sensitive information (UPSI) can execute trades?',
    'Trading window is closed until 48 hours post-disclosure', '24 hours post-disclosure', '7 days', 'No cooling off is required if documented',
    'A', 'HARD',
    'Under SEBI (Prohibition of Insider Trading) Regulations, the trading window remains closed until 48 hours after the unpublished price sensitive information becomes generally available to the public.'
  ),
  (
    '00000007-0000-0000-0000-000000000008',
    '00000002-0000-0000-0000-000000000002',
    'If the Spot price of Reliance is ₹3,000, risk-free interest rate is 7% p.a., and no dividends are expected for 3 months (0.25 years), what is the theoretical futures price?',
    '₹3,000.00', '₹3,052.50', '₹2,947.50', '₹3,210.00',
    'B', 'HARD',
    'Fair Value = S × (1 + r × t) = 3000 × (1 + 0.07 × 0.25) = 3000 × (1 + 0.0175) = ₹3,052.50.'
  ),
  (
    '00000007-0000-0000-0000-000000000009',
    '00000002-0000-0000-0000-000000000003',
    'In an Iron Condor strategy, which combination of options is sold to construct the inner core of the payoff?',
    'OTM Call and OTM Put', 'ITM Call and ITM Put', 'ATM Call and ITM Put', 'OTM Call and ITM Call',
    'A', 'MEDIUM',
    'An Iron Condor sells an OTM Put (lower strike) and an OTM Call (higher strike) while purchasing further OTM wings to cap maximum risk.'
  ),
  (
    '00000007-0000-0000-0000-000000000010',
    '00000002-0000-0000-0000-000000000006',
    'What threshold of aggregate Open Interest triggers a Market-Wide Position Limit (MWPL) ban in the Indian derivative segment?',
    '80%', '90%', '95%', '100%',
    'C', 'MEDIUM',
    'Under SEBI guidelines, when total aggregate open interest crosses 95% of MWPL, the stock derivative enters a ban period where only position reduction is allowed.'
  ),
  (
    '00000007-0000-0000-0000-000000000011',
    '00000002-0000-0000-0000-000000000004',
    'A bond has a Macaulay Duration of 4.2 years and a Yield to Maturity of 5%. What is its Modified Duration (assuming annual compounding)?',
    '4.20 years', '4.00 years', '4.41 years', '3.80 years',
    'B', 'MEDIUM',
    'Modified Duration = Macaulay Duration / (1 + y) = 4.20 / (1 + 0.05) = 4.20 / 1.05 = 4.00 years.'
  ),
  (
    '00000007-0000-0000-0000-000000000012',
    '00000002-0000-0000-0000-000000000004',
    'If a bond is trading at a discount to its par value, which of the following yield relationships is correct?',
    'Coupon Rate > Current Yield > YTM', 'Coupon Rate = Current Yield = YTM', 'YTM > Current Yield > Coupon Rate', 'Current Yield > YTM > Coupon Rate',
    'C', 'EASY',
    'When a bond trades at a discount (Price < Face Value), the Yield to Maturity (YTM) is the highest, followed by Current Yield, and Coupon Rate is the lowest.'
  ),
  (
    '00000007-0000-0000-0000-000000000013',
    '00000002-0000-0000-0000-000000000005',
    'A company has EBIT of ₹500 Cr, tax rate of 25%, Depreciation of ₹80 Cr, CapEx of ₹120 Cr, and increase in Working Capital of ₹35 Cr. What is its Free Cash Flow to Firm (FCFF)?',
    '₹300 Cr', '₹375 Cr', '₹425 Cr', '₹345 Cr',
    'A', 'HARD',
    'FCFF = EBIT × (1 - t) + D&A - CapEx - ΔNWC = 500 × (1 - 0.25) + 80 - 120 - 35 = 375 + 80 - 120 - 35 = ₹300 Cr.'
  ),
  (
    '00000007-0000-0000-0000-000000000014',
    '00000002-0000-0000-0000-000000000005',
    'According to the Capital Asset Pricing Model (CAPM), if Risk-Free Rate is 6%, Market Return is 14%, and Stock Beta is 1.25, what is the Cost of Equity?',
    '14.0%', '16.0%', '17.5%', '18.5%',
    'B', 'MEDIUM',
    'Cost of Equity Ke = Rf + Beta × (Rm - Rf) = 6% + 1.25 × (14% - 6%) = 6% + 1.25 × 8% = 6% + 10% = 16.0%.'
  ),
  (
    '00000007-0000-0000-0000-000000000015',
    '00000002-0000-0000-0000-000000000006',
    'Under SEBI (Research Analysts) Regulations, 2014, an individual research analyst cannot trade in the subject stock within how many days of issuing a research report?',
    '30 days prior and 5 days after', '15 days prior and 10 days after', '60 days prior and 30 days after', 'No trading restriction applies if disclosed',
    'A', 'HARD',
    'SEBI regulations prohibit a Research Analyst from dealing or trading in securities that the analyst recommends within 30 days immediately preceding and 5 days following the publication of the research report.'
  ),
  (
    '00000007-0000-0000-0000-000000000016',
    '00000002-0000-0000-0000-000000000001',
    'What mechanism is primarily used by central banks to absorb short-term excess liquidity from commercial banks?',
    'Repo Rate Operations', 'Standing Deposit Facility (SDF) / Reverse Repo', 'Initial Public Offering (IPO)', 'Commercial Paper Issuance',
    'B', 'EASY',
    'The Standing Deposit Facility (SDF) and Reverse Repo operations allow the central bank to absorb surplus liquidity without requiring collateral securities.'
  ),
  (
    '00000007-0000-0000-0000-000000000017',
    '00000002-0000-0000-0000-000000000001',
    'In a continuous double auction order book, if the best Bid is ₹2,450.00 (Qty 500) and the best Ask is ₹2,450.50 (Qty 300), what is the immediate Bid-Ask spread?',
    '₹0.50', '₹0.00', '₹1.00', '₹200.00',
    'A', 'EASY',
    'Bid-Ask Spread = Best Ask - Best Bid = ₹2,450.50 - ₹2,450.00 = ₹0.50.'
  ),
  (
    '00000007-0000-0000-0000-000000000018',
    '00000002-0000-0000-0000-000000000001',
    'The Sharpe Ratio of an investment portfolio evaluates:',
    'Excess return earned per unit of total risk (Standard Deviation)', 'Total return divided by maximum drawdown', 'Downside risk relative to target benchmark', 'Market Beta multiplied by dividend yield',
    'A', 'EASY',
    'Sharpe Ratio = (Rp - Rf) / σp, measuring risk-adjusted excess return per unit of total volatility (standard deviation).'
  ),
  (
    '00000007-0000-0000-0000-000000000019',
    '00000002-0000-0000-0000-000000000002',
    'When a futures contract trades at a price LOWER than the theoretical cash-and-carry fair value, which arbitrage is executed?',
    'Cash-and-Carry Arbitrage (Buy Spot, Sell Futures)', 'Reverse Cash-and-Carry Arbitrage (Short Spot, Buy Futures)', 'Covered Call Writing', 'Long Straddle Execution',
    'B', 'MEDIUM',
    'When futures trade at a discount to theoretical value (underpriced), the arbitrageur executes Reverse Cash-and-Carry: short sells the spot asset and buys the cheap futures.'
  ),
  (
    '00000007-0000-0000-0000-000000000020',
    '00000002-0000-0000-0000-000000000003',
    'An investor writes a Naked Put option with strike ₹1,800 for a premium of ₹35. What is the maximum possible loss for the option seller?',
    '₹35 per share', '₹1,800 per share', '₹1,765 per share', 'Unlimited',
    'C', 'MEDIUM',
    'Max loss for a Put seller occurs if the stock falls to ₹0. Max Loss = Strike - Premium = ₹1,800 - ₹35 = ₹1,765 per share.'
  ),
  (
    '00000007-0000-0000-0000-000000000021',
    '00000002-0000-0000-0000-000000000004',
    'An inverted yield curve, where short-term yields exceed long-term yields, typically signals:',
    'Strong economic expansion and accelerating inflation', 'Expectations of impending economic slowdown or central bank rate cuts', 'High corporate default risk across sovereign bonds', 'Stable constant inflation expectations',
    'B', 'MEDIUM',
    'An inverted yield curve historically indicates market consensus that central banks will need to ease rates in the future due to recessionary pressures.'
  ),
  (
    '00000007-0000-0000-0000-000000000022',
    '00000002-0000-0000-0000-000000000005',
    'Enterprise Value (EV) is best defined as:',
    'Market Capitalization + Total Debt - Cash & Cash Equivalents', 'Total Assets minus Total Liabilities', 'Net Income divided by Book Value of Equity', 'EBITDA multiplied by Price-to-Earnings Ratio',
    'A', 'EASY',
    'EV = Market Cap + Debt + Preferred Stock + Minority Interest - Cash & Equivalents. It represents the total acquisition cost of the operational core of a business.'
  ),
  (
    '00000007-0000-0000-0000-000000000023',
    '00000002-0000-0000-0000-000000000006',
    'Under SEBI peak margin norms, what proportion of upfront margin must be collected by trading members from clients on intraday positions?',
    '50%', '75%', '100%', '25%',
    'C', 'EASY',
    'SEBI mandates 100% upfront peak margin collection across all intraday derivative and cash market positions.'
  ),
  (
    '00000007-0000-0000-0000-000000000024',
    '00000002-0000-0000-0000-000000000001',
    'Which type of financial risk CANNOT be eliminated through portfolio diversification?',
    'Systematic (Market) Risk', 'Unsystematic (Company-specific) Risk', 'Operational Risk', 'Credit Risk of an individual issuer',
    'A', 'EASY',
    'Systematic risk (macroeconomic shocks, interest rate shifts, geopolitics) affects the entire market and cannot be diversified away, unlike idiosyncratic/unsystematic company risks.'
  )
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  correct_option = EXCLUDED.correct_option,
  difficulty = EXCLUDED.difficulty,
  explanation = EXCLUDED.explanation;

-- ----------------------------------------------------------------------------
-- 8. LESSONS (13 Comprehensive Lessons across 4 Courses)
-- ----------------------------------------------------------------------------
INSERT INTO public.lessons (id, course_id, topic_id, title, description, order_index, estimated_minutes)
VALUES
  ('00000005-0000-0000-0000-000000000001', '00000004-0000-0000-0000-000000000001', '00000002-0000-0000-0000-000000000002', 'Fundamentals of Futures Contracts & Cost of Carry Model', 'Introduction to forwards vs futures, cash-and-carry arbitrage equilibrium, basis calculation, and open interest.', 1, 22),
  ('00000005-0000-0000-0000-000000000002', '00000004-0000-0000-0000-000000000001', '00000002-0000-0000-0000-000000000003', 'Option Greeks Deep Dive: Delta, Gamma & Theta Decay', 'Rigorous sensitivity calculations using Black-Scholes-Merton math: Delta velocity, Gamma curvature, and Theta time decay.', 2, 35),
  ('00000005-0000-0000-0000-000000000003', '00000004-0000-0000-0000-000000000001', '00000002-0000-0000-0000-000000000003', 'Multi-Leg Strategies: Bull Spreads, Straddles & Iron Condors', 'Constructing asymmetric risk-reward payoffs, volatility breakouts, and delta-neutral market-making hedges.', 3, 28),
  ('00000005-0000-0000-0000-000000000004', '00000004-0000-0000-0000-000000000001', '00000002-0000-0000-0000-000000000005', 'Regulatory Safeguards, Margining & SEBI Risk Framework', 'SPAN margin mechanics, exposure margins, peak margin enforcement, and regulatory compliance standards.', 4, 25),
  ('00000005-0000-0000-0000-000000000005', '00000004-0000-0000-0000-000000000002', '00000002-0000-0000-0000-000000000004', 'Bond Pricing Mechanics, Spot Rates & Yield to Maturity (YTM)', 'Clean vs dirty bond prices, accrued interest, par yield curves, and spot interest rate interpolation.', 1, 30),
  ('00000005-0000-0000-0000-000000000006', '00000004-0000-0000-0000-000000000002', '00000002-0000-0000-0000-000000000004', 'Macaulay Duration, Modified Duration & Convexity Hedging', 'Interest rate elasticity, portfolio duration matching, and second-order convexity adjustments.', 2, 32),
  ('00000005-0000-0000-0000-000000000007', '00000004-0000-0000-0000-000000000002', '00000002-0000-0000-0000-000000000004', 'Term Structure of Interest Rates & Credit Default Spreads', 'Analyze yield curve dynamics (normal, inverted, flat), expectations theory, and corporate credit risk pricing.', 3, 40),
  ('00000005-0000-0000-0000-000000000008', '00000004-0000-0000-0000-000000000003', '00000002-0000-0000-0000-000000000005', 'Fundamental Analysis, Financial Statement Reconstruction & Free Cash Flow', 'Master financial statement analysis, quality of earnings adjustments, FCFF vs FCFE derivations, and working capital cycles.', 1, 45),
  ('00000005-0000-0000-0000-000000000009', '00000004-0000-0000-0000-000000000003', '00000002-0000-0000-0000-000000000005', 'Discounted Cash Flow (DCF) Modeling & Relative Valuation Multiples', 'Build robust intrinsic DCF valuation models, derive WACC, calculate terminal value, and apply comparative multiples.', 2, 50),
  ('00000005-0000-0000-0000-000000000010', '00000004-0000-0000-0000-000000000003', '00000002-0000-0000-0000-000000000006', 'SEBI (Research Analysts) Regulations, 2014 & Code of Conduct', 'Understand mandatory disclosures, conflict of interest safeguards, trading restrictions, and statutory compliance.', 3, 35),
  ('00000005-0000-0000-0000-000000000011', '00000004-0000-0000-0000-000000000004', '00000002-0000-0000-0000-000000000001', 'From Barter to Digital Fiat: The Architecture of Money & Central Banking', 'Explore the evolution of currency, fractional reserve mechanics, fiat money issuance, and central bank monetary transmission.', 1, 30),
  ('00000005-0000-0000-0000-000000000012', '00000004-0000-0000-0000-000000000004', '00000002-0000-0000-0000-000000000001', 'Capital Formation, Primary Issues & Secondary Exchange Order Books', 'Understand IPO capital formation, red herring prospectuses, continuous limit order books, and bid-ask spreads.', 2, 35),
  ('00000005-0000-0000-0000-000000000013', '00000004-0000-0000-0000-000000000004', '00000002-0000-0000-0000-000000000001', 'Risk-Return Profiles, Modern Portfolio Theory & Asset Allocation', 'Learn risk-adjusted returns, Sharpe and Sortino ratios, correlation and covariance, efficient frontier, and diversification.', 3, 40)
ON CONFLICT (course_id, order_index) DO UPDATE SET
  topic_id = EXCLUDED.topic_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes;

-- ----------------------------------------------------------------------------
-- 9. LESSON CONTENT
-- ----------------------------------------------------------------------------
INSERT INTO public.lesson_content (id, lesson_id, content_type, raw_body, display_order, metadata)
VALUES
  (
    '00000006-0000-0000-0000-000000000001',
    '00000005-0000-0000-0000-000000000002',
    'MARKDOWN_TEXT',
    '## Option Greeks: Delta, Gamma, Theta & Vega

In options trading, **Greeks** measure the sensitivity of an option''s price to various underlying parameters such as the spot price, time decay, volatility, and interest rates.

### 1. Delta (Δ) — Price Sensitivity
Delta measures the expected change in option premium for every **₹1 change** in the underlying stock price.
- **Call Option Delta:** Ranges from **0.0 to +1.0**
- **Put Option Delta:** Ranges from **-1.0 to 0.0**
- *At-The-Money (ATM) options typically have a Delta near ±0.50.*

### 2. Gamma (Γ) — Acceleration of Delta
Gamma measures the rate of change of Delta per ₹1 move in the underlying asset. Think of Delta as speed and Gamma as acceleration.
- Highest for ATM options near expiry.
- High Gamma implies high risk for option sellers as Delta shifts rapidly.

### 3. Theta (Θ) — Time Decay
Theta represents the amount by which the option price declines each day as expiration approaches (time decay).
- Option buyers **lose** Theta each day (*negative Theta*).
- Option sellers **benefit** from Theta decay (*positive Theta*).

### 4. Vega (ν) — Volatility Sensitivity
Vega measures the change in option price for a **1% change in Implied Volatility (IV)**.
- Both Call and Put buyers are Long Vega (profit when volatility surges).',
    1,
    '{"key_takeaways": ["Delta measures direction and probability of expiring in-the-money.", "Gamma is the curvature of option payoff and peaks at ATM strikes.", "Theta decay accelerates exponentially during the final 10 days before expiry.", "Option sellers capture Theta decay while accepting tail Gamma risk."], "formulas": [{"label": "Delta Formula (Black-Scholes)", "formula": "Δ_{Call} = N(d_1), \\quad Δ_{Put} = N(d_1) - 1", "explanation": "Where N(d1) is the standard normal cumulative distribution function."}, {"label": "Theta Daily Decay Approximation", "formula": "Θ \\approx -\\frac{S_0 \\cdot σ \\cdot n(d_1)}{2\\sqrt{T}} - r K e^{-rT} N(d_2)", "explanation": "Negative derivative with respect to time to maturity T."}]}'::jsonb
  ),
  (
    '00000006-0000-0000-0000-000000000002',
    '00000005-0000-0000-0000-000000000001',
    'VIDEO',
    '## Cost of Carry Model & Arbitrage Equilibrium
When pricing a futures contract on an underlying equity or index, the theoretical price is governed by the **Cost of Carry Model**.

### Core Equation:
$$F = S \\times e^{(r + s - q) \\times T}$$

- **S:** Current Spot Price
- **r:** Risk-free interest rate (e.g. RBI 91-day T-Bill yield)
- **s:** Storage costs (for commodities)
- **q:** Dividend yield (for equity indices)
- **T:** Time to maturity in years

### Arbitrage Bounds:
1. If $F_{market} > F_{theoretical}$ (Overpriced Futures): Buy Spot, Short Futures (**Cash-and-Carry Arbitrage**).
2. If $F_{market} < F_{theoretical}$ (Underpriced Futures): Short Spot, Buy Futures (**Reverse Cash-and-Carry Arbitrage**).',
    1,
    '{"key_takeaways": ["Futures pricing is tied mathematically to spot price plus financing carrying cost.", "Arbitrage guarantees market futures trade near fair theoretical value under efficient conditions.", "Negative basis indicates backwardation, whereas positive basis indicates contango."], "formulas": [{"label": "Theoretical Futures Price", "formula": "F = S_0 \\times (1 + r \\times \\frac{t}{365}) - D", "explanation": "Discrete simplified formula with dividend adjustment D."}]}'::jsonb
  ),
  (
    '00000006-0000-0000-0000-000000000003',
    '00000005-0000-0000-0000-000000000003',
    'MARKDOWN_TEXT',
    '## Multi-Leg Option Strategies: Spreads, Straddles & Condors

### 1. Vertical Spreads (Directional with Defined Risk)
A **Bull Call Spread** involves buying an In-The-Money (ITM) or At-The-Money (ATM) Call option ($K_1$) and simultaneously selling an Out-Of-The-Money (OTM) Call option ($K_2$, where $K_2 > K_1$).
- **Net Debit**: $C_1 - C_2$
- **Max Profit**: $(K_2 - K_1) - \\text{Net Debit}$
- **Max Loss**: $\\text{Net Debit}$
- **Break-Even**: $K_1 + \\text{Net Debit}$

### 2. Iron Condor (Range-Bound Theta Harvesting)
- Sell OTM Put ($K_2$) & Buy further OTM Put ($K_1$) [Bull Put Spread]
- Sell OTM Call ($K_3$) & Buy further OTM Call ($K_4$) [Bear Call Spread]
- **Objective**: Capture maximum credit if the underlying expires between $K_2$ and $K_3$.',
    1,
    '{"key_takeaways": ["Vertical spreads cap upside while eliminating catastrophic tail loss.", "Iron Condors capture time decay during consolidation ranges."]}'::jsonb
  ),
  (
    '00000006-0000-0000-0000-000000000004',
    '00000005-0000-0000-0000-000000000004',
    'MARKDOWN_TEXT',
    '## Regulatory Safeguards & SEBI Risk Management Framework

### 1. Margining Architecture in Indian Derivatives
SEBI mandates a real-time portfolio-based margining system to ensure systemic stability across clearing corporations.
- **SPAN Margin**: Calculates the worst-case portfolio loss across 16 theoretical price and volatility scan scenarios.
- **Extreme Loss Margin (ELM)**: Covers catastrophic event risk (typically 3.5% for equity derivatives).
- **Peak Margin Framework**: Exchanges take 4 random intraday margin snapshots to enforce upfront margin compliance.

### 2. Position Limits & MWPL
- **Client Level Limit**: Maximum open position cannot exceed 5% of total market-wide position limit (MWPL).
- **MWPL Ban Period**: Triggered when aggregate open interest across all participants exceeds 95% of allowable limit.',
    1,
    '{"key_takeaways": ["SPAN margin evaluates multi-scenario portfolio risk.", "Peak margin prevents excessive broker intraday leverage."]}'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  content_type = EXCLUDED.content_type,
  raw_body = EXCLUDED.raw_body,
  metadata = EXCLUDED.metadata;

-- ----------------------------------------------------------------------------
-- 10. QUIZZES (5 Comprehensive Quizzes across Topics)
-- ----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, topic_id, course_id, title, quiz_type, passing_score_percent, time_limit_minutes)
VALUES
  ('00000008-0000-0000-0000-000000000001', '00000002-0000-0000-0000-000000000003', '00000004-0000-0000-0000-000000000001', 'Option Greeks & Volatility Mastery Quiz', 'PRACTICE', 75, 10),
  ('00000008-0000-0000-0000-000000000002', '00000002-0000-0000-0000-000000000002', '00000004-0000-0000-0000-000000000001', 'Futures Pricing & Cash-and-Carry Quiz', 'PRACTICE', 70, 8),
  ('00000008-0000-0000-0000-000000000003', '00000002-0000-0000-0000-000000000004', '00000004-0000-0000-0000-000000000002', 'Bond Duration & Yield Curve Checkpoint', 'PRACTICE', 80, 12),
  ('00000008-0000-0000-0000-000000000004', '00000002-0000-0000-0000-000000000005', '00000004-0000-0000-0000-000000000003', 'Equity Research, DCF & SEBI Regulations Quiz', 'PRACTICE', 75, 15),
  ('00000008-0000-0000-0000-000000000005', '00000002-0000-0000-0000-000000000001', '00000004-0000-0000-0000-000000000004', 'Financial Architecture & Portfolio Foundations Quiz', 'PRACTICE', 70, 12)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  passing_score_percent = EXCLUDED.passing_score_percent,
  time_limit_minutes = EXCLUDED.time_limit_minutes;

-- ----------------------------------------------------------------------------
-- 11. QUIZ QUESTIONS MAPPING (24 Question Associations)
-- ----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (quiz_id, question_id, question_order, mark)
VALUES
  -- Quiz 1 (Options & Volatility): Q1, Q2, Q3, Q4, Q5, Q9, Q20
  ('00000008-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000001', 1, 2),
  ('00000008-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000002', 2, 2),
  ('00000008-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000003', 3, 2),
  ('00000008-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000004', 4, 2),
  ('00000008-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000005', 5, 2),
  ('00000008-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000009', 6, 2),
  ('00000008-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000020', 7, 2),

  -- Quiz 2 (Futures & Margining): Q8, Q10, Q19, Q23
  ('00000008-0000-0000-0000-000000000002', '00000007-0000-0000-0000-000000000008', 1, 2),
  ('00000008-0000-0000-0000-000000000002', '00000007-0000-0000-0000-000000000010', 2, 2),
  ('00000008-0000-0000-0000-000000000002', '00000007-0000-0000-0000-000000000019', 3, 2),
  ('00000008-0000-0000-0000-000000000002', '00000007-0000-0000-0000-000000000023', 4, 2),

  -- Quiz 3 (Fixed Income & Bonds): Q6, Q11, Q12, Q21
  ('00000008-0000-0000-0000-000000000003', '00000007-0000-0000-0000-000000000006', 1, 2),
  ('00000008-0000-0000-0000-000000000003', '00000007-0000-0000-0000-000000000011', 2, 2),
  ('00000008-0000-0000-0000-000000000003', '00000007-0000-0000-0000-000000000012', 3, 2),
  ('00000008-0000-0000-0000-000000000003', '00000007-0000-0000-0000-000000000021', 4, 2),

  -- Quiz 4 (Equity Research & Valuation): Q7, Q13, Q14, Q15, Q22
  ('00000008-0000-0000-0000-000000000004', '00000007-0000-0000-0000-000000000007', 1, 2),
  ('00000008-0000-0000-0000-000000000004', '00000007-0000-0000-0000-000000000013', 2, 2),
  ('00000008-0000-0000-0000-000000000004', '00000007-0000-0000-0000-000000000014', 3, 2),
  ('00000008-0000-0000-0000-000000000004', '00000007-0000-0000-0000-000000000015', 4, 2),
  ('00000008-0000-0000-0000-000000000004', '00000007-0000-0000-0000-000000000022', 5, 2),

  -- Quiz 5 (Markets & Portfolios): Q16, Q17, Q18, Q24
  ('00000008-0000-0000-0000-000000000005', '00000007-0000-0000-0000-000000000016', 1, 2),
  ('00000008-0000-0000-0000-000000000005', '00000007-0000-0000-0000-000000000017', 2, 2),
  ('00000008-0000-0000-0000-000000000005', '00000007-0000-0000-0000-000000000018', 3, 2),
  ('00000008-0000-0000-0000-000000000005', '00000007-0000-0000-0000-000000000024', 4, 2)
ON CONFLICT (quiz_id, question_id) DO UPDATE SET
  question_order = EXCLUDED.question_order,
  mark = EXCLUDED.mark;

-- ----------------------------------------------------------------------------
-- 12. MOCK EXAM QUESTIONS MAPPING (All 3 Exams Fully Mapped)
-- ----------------------------------------------------------------------------
INSERT INTO public.mock_exam_questions (exam_id, question_id, question_order, mark, negative_mark)
VALUES
  -- Mock Exam 1 (NISM Series VIII: Equity Derivatives)
  ('00000009-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000001', 1, 1, 0.25),
  ('00000009-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000002', 2, 1, 0.25),
  ('00000009-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000003', 3, 1, 0.25),
  ('00000009-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000004', 4, 1, 0.25),
  ('00000009-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000005', 5, 1, 0.25),
  ('00000009-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000008', 6, 1, 0.25),
  ('00000009-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000009', 7, 1, 0.25),
  ('00000009-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000010', 8, 1, 0.25),
  ('00000009-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000019', 9, 1, 0.25),
  ('00000009-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000020', 10, 1, 0.25),
  ('00000009-0000-0000-0000-000000000001', '00000007-0000-0000-0000-000000000023', 11, 1, 0.25),

  -- Mock Exam 2 (NISM Series XV: Research Analyst)
  ('00000009-0000-0000-0000-000000000002', '00000007-0000-0000-0000-000000000007', 1, 1, 0.25),
  ('00000009-0000-0000-0000-000000000002', '00000007-0000-0000-0000-000000000013', 2, 1, 0.25),
  ('00000009-0000-0000-0000-000000000002', '00000007-0000-0000-0000-000000000014', 3, 1, 0.25),
  ('00000009-0000-0000-0000-000000000002', '00000007-0000-0000-0000-000000000015', 4, 1, 0.25),
  ('00000009-0000-0000-0000-000000000002', '00000007-0000-0000-0000-000000000018', 5, 1, 0.25),
  ('00000009-0000-0000-0000-000000000002', '00000007-0000-0000-0000-000000000022', 6, 1, 0.25),
  ('00000009-0000-0000-0000-000000000002', '00000007-0000-0000-0000-000000000024', 7, 1, 0.25),

  -- Mock Exam 3 (NCFM Financial Markets & Debt)
  ('00000009-0000-0000-0000-000000000003', '00000007-0000-0000-0000-000000000006', 1, 1, 0.25),
  ('00000009-0000-0000-0000-000000000003', '00000007-0000-0000-0000-000000000011', 2, 1, 0.25),
  ('00000009-0000-0000-0000-000000000003', '00000007-0000-0000-0000-000000000012', 3, 1, 0.25),
  ('00000009-0000-0000-0000-000000000003', '00000007-0000-0000-0000-000000000016', 4, 1, 0.25),
  ('00000009-0000-0000-0000-000000000003', '00000007-0000-0000-0000-000000000017', 5, 1, 0.25),
  ('00000009-0000-0000-0000-000000000003', '00000007-0000-0000-0000-000000000021', 6, 1, 0.25)
ON CONFLICT (exam_id, question_id) DO UPDATE SET
  question_order = EXCLUDED.question_order,
  mark = EXCLUDED.mark,
  negative_mark = EXCLUDED.negative_mark;
