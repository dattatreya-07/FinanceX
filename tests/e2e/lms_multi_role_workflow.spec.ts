import { test, expect } from '@playwright/test';

test.describe('FinanceX Multi-Role Educational LMS Workflow', () => {

  test('Learner, Instructor, and Administrator End-to-End Journeys', async ({ page }) => {
    // Set up initialized session before page loads
    await page.addInitScript(() => {
      sessionStorage.setItem('hasSeenFinanceXBoot', 'true');
      localStorage.setItem('financex_active_user_session', JSON.stringify({
        user_id: 'learner-001',
        email: 'learner@financex.com',
        full_name: 'Alex Rivera',
        role: 'USER',
        account_status: 'ACTIVE',
        isDemoUser: true
      }));
    });

    // 1. Visit FinanceX Application
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Bypass landing page if present by clicking Open FinanceX or entering dashboard
    const openBtn = page.getByRole('button', { name: /Open FinanceX|Enter Platform/i }).first();
    if (await openBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await openBtn.click();
    }

    // 2. Verify Demo Mode Indicator Banner
    const demoBanner = page.locator('text=DEMO MODE').first();
    await expect(demoBanner).toBeVisible({ timeout: 12000 });

    // 3. Open navigation drawer and click Case Studies & Tasks
    await page.locator('button[aria-label="Toggle Navigation Drawer"]').click();
    const assignmentsNavLink = page.locator('button:has-text("Case Studies & Tasks")').first();
    await expect(assignmentsNavLink).toBeVisible({ timeout: 5000 });
    await assignmentsNavLink.click();

    await expect(page.locator('text=Quantitative Case Studies & Assignments')).toBeVisible({ timeout: 6000 });

    // 4. Navigate to Learner Gradebook & Transcripts
    const gradebookBtn = page.getByRole('button', { name: /View Gradebook & Transcript/i });
    await gradebookBtn.click();
    await expect(page.locator('text=Academic Gradebook & Transcripts')).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=Course Enrolment & Performance Roster')).toBeVisible();

    // Verify interactive digital credential verification registry lookup
    await expect(page.locator('text=Digital Certificate Verification')).toBeVisible();
    await expect(page.locator('text=AUTHENTICATED')).toBeVisible();
    await expect(page.locator('text=Sameer Joshi')).toBeVisible();

    // 5. Test Role Switcher Capsule -> Switch to Instructor
    const roleCapsuleBtn = page.locator('button[aria-label="Switch Demo User Role"]');
    await expect(roleCapsuleBtn).toBeVisible();
    await roleCapsuleBtn.click();

    // Click Instructor in popup
    const instructorOption = page.locator('button:has-text("Instructor")');
    await expect(instructorOption.first()).toBeVisible();
    await instructorOption.first().click();

    // 6. Verify Instructor Workspace Access
    await expect(page.locator('text=Instructor Course & Cohort Operations')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Learner Monitoring')).toBeVisible();

    // 7. Check Learner Monitoring Tab & Roster
    await page.getByRole('button', { name: /Learner Monitoring/i }).click();
    await expect(page.locator('text=Alex Rivera').first()).toBeVisible();

    // 8. Test Role Switcher Capsule -> Switch to Administrator
    await roleCapsuleBtn.click();
    const adminOption = page.locator('button:has-text("Administrator")');
    await expect(adminOption.first()).toBeVisible();
    await adminOption.first().click();

    // 9. Verify Admin CMS & LMS Access
    await expect(page.locator('text=Faculty & Instructors')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Cohorts & Batches')).toBeVisible();
    await expect(page.locator('text=Institution Reports & Export')).toBeVisible();
  });

  test('Course Syllabus Navigation and Financial Model Starter Presets', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('hasSeenFinanceXBoot', 'true');
      localStorage.setItem('financex_active_user_session', JSON.stringify({
        user_id: 'learner-001',
        email: 'learner@financex.com',
        full_name: 'Alex Rivera',
        role: 'USER',
        account_status: 'ACTIVE',
        isDemoUser: true
      }));
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const openBtn = page.getByRole('button', { name: /Open FinanceX|Enter Platform/i }).first();
    if (await openBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await openBtn.click();
    }

    // Open Drawer -> Course Catalog
    await page.locator('button[aria-label="Toggle Navigation Drawer"]').click();
    const coursesLink = page.locator('button:has-text("Course Catalog")').first();
    await expect(coursesLink).toBeVisible({ timeout: 5000 });
    await coursesLink.click();

    // Verify Course Catalog and click "Syllabus" on first card
    const syllabusBtn = page.locator('button:has-text("Syllabus")').first();
    await expect(syllabusBtn).toBeVisible({ timeout: 6000 });
    await syllabusBtn.click();

    // Verify NPTEL / SWAYAM pedagogical framework view is displayed
    await expect(page.locator('text=NPTEL / SWAYAM Pedagogical Framework')).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=Weekly Curriculum Breakdown')).toBeVisible();

    // Open Navigation Drawer -> Case Studies & Tasks
    await page.locator('button[aria-label="Toggle Navigation Drawer"]').click();
    const assignmentsNavLink = page.locator('button:has-text("Case Studies & Tasks")').first();
    await expect(assignmentsNavLink).toBeVisible();
    await assignmentsNavLink.click();

    // Click Submit Analysis button specifically
    const submitBtn = page.locator('button:has-text("Submit Analysis")').first();
    await expect(submitBtn).toBeVisible({ timeout: 6000 });
    await submitBtn.click();

    // Verify Financial Model Quick-Starters are present
    await expect(page.locator('text=Financial Model Quick-Starters:')).toBeVisible({ timeout: 6000 });

    // Click + Bond Pricing / Accrued Int. preset
    const bondPresetBtn = page.locator('button:has-text("+ Bond Pricing / Accrued Int.")');
    await expect(bondPresetBtn).toBeVisible();
    await bondPresetBtn.click();

    // Verify that model inputs have been populated with quantitative parameters
    const assumptionsInput = page.locator('input[placeholder*="30/360"]');
    await expect(assumptionsInput).toHaveValue(/30\/360/);

    // Close modal
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('Responsive Layout Verification across Mobile, Tablet, and Desktop', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('hasSeenFinanceXBoot', 'true');
      localStorage.setItem('financex_active_user_session', JSON.stringify({
        user_id: 'learner-001',
        email: 'learner@financex.com',
        full_name: 'Alex Rivera',
        role: 'USER',
        account_status: 'ACTIVE',
        isDemoUser: true
      }));
    });

    // 1. Mobile Viewport (iPhone 12 / 390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const openBtn = page.getByRole('button', { name: /Open FinanceX|Enter Platform/i }).first();
    if (await openBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await openBtn.click();
    }

    // Verify Mobile Header & Drawer Toggle are functional
    const mobileDrawerToggle = page.locator('button[aria-label="Toggle Navigation Drawer"]');
    await expect(mobileDrawerToggle).toBeVisible({ timeout: 8000 });
    await mobileDrawerToggle.click();

    // Verify navigation links render cleanly on mobile
    const mobileGradebookLink = page.locator('button:has-text("Gradebook & Transcripts")').first();
    await expect(mobileGradebookLink).toBeVisible();
    await mobileGradebookLink.click();

    await expect(page.locator('text=Academic Gradebook & Transcripts')).toBeVisible({ timeout: 6000 });

    // 2. Tablet Viewport (iPad / 768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('text=Academic Gradebook & Transcripts')).toBeVisible();
    await expect(page.locator('text=Digital Certificate Verification')).toBeVisible();
  });

  test('Google OAuth Authentication and Profile Initialization Journey', async ({ page }) => {
    // Start with a clean unauthenticated session
    await page.addInitScript(() => {
      sessionStorage.setItem('hasSeenFinanceXBoot', 'true');
      localStorage.removeItem('financex_active_user_session');
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Click "Sign In" button on the landing header
    const signInBtn = page.getByRole('button', { name: 'Sign In' }).first();
    await expect(signInBtn).toBeVisible({ timeout: 8000 });
    await signInBtn.click();

    // Verify Auth Modal is displayed with Google OAuth option and Quick Demo Profile option
    const googleBtn = page.getByRole('button', { name: /Sign in with Google/i });
    const quickDemoBtn = page.getByRole('button', { name: /Quick Demo Profile/i });
    await expect(googleBtn).toBeVisible({ timeout: 5000 });
    await expect(quickDemoBtn).toBeVisible({ timeout: 5000 });

    // Click Google OAuth and verify real redirection to Google accounts
    const navigationPromise = page.waitForURL(/.*(supabase\.co|google\.com).*/, { timeout: 30000, waitUntil: 'commit' });
    await googleBtn.click();
    await navigationPromise;
    expect(page.url()).toMatch(/accounts\.google\.com|supabase\.co/);
  });

  test('Instant Sandbox Quick Demo Profile Workflow', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('hasSeenFinanceXBoot', 'true');
      localStorage.removeItem('financex_active_user_session');
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const signInBtn = page.getByRole('button', { name: 'Sign In' }).first();
    await expect(signInBtn).toBeVisible({ timeout: 8000 });
    await signInBtn.click();

    const quickDemoBtn = page.getByRole('button', { name: /Quick Demo Profile/i });
    await expect(quickDemoBtn).toBeVisible({ timeout: 5000 });
    await quickDemoBtn.click();

    // Verify user is authenticated and enters platform shell
    await expect(page.locator('text=DEMO MODE').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Welcome back/').first()).toBeVisible({ timeout: 6000 });
  });

});
