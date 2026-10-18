# IEEE Boundary Value Analysis (BVA) & Calculator Test Matrix

## 1. Statutory Redundancy Pay (SRP) Boundary Matrix

Under ERA 1996 s.162, statutory redundancy pay is calculated based on completed years of continuous service (up to a maximum of 20), multiplied by the statutory age factor, capped at the statutory weekly pay cap.

| Test ID | Age | Service (Months / Years) | Weekly Pay (£) | Jurisdiction | Expected Multiplier Calculation | Expected SRP Output (£) | Boundary Tested |
| :--- | :---: | :---: | :---: | :---: | :--- | :---: | :--- |
| **BVA-SRP-01** | 25 | 11 months (< 1 yr) | £600 | GB | Ineligible (s.155: < 24 months) | £0 | Zero service boundary |
| **BVA-SRP-02** | 25 | 23 months (1 yr 11m) | £600 | GB | Ineligible (s.155: < 24 months) | £0 | Just below 2-year threshold |
| **BVA-SRP-03** | 21 | 24 months (2 full yrs) | £500 | GB | 2 yrs × 0.5 = 1.0 week × £500 | £1,000 | Qualifying threshold, under 22 band |
| **BVA-SRP-04** | 22 | 24 months (2 full yrs) | £500 | GB | 1 yr at 22 (1.0) + 1 yr at 21 (0.5) = 1.5 wks | £750 | Age 21/22 transition boundary |
| **BVA-SRP-05** | 30 | 60 months (5 full yrs) | £600 | GB | 5 yrs × 1.0 = 5.0 weeks × £600 | £3,000 | Middle band (22–40) |
| **BVA-SRP-06** | 41 | 36 months (3 full yrs) | £600 | GB | 1 yr at 41 (1.5) + 2 yrs at 40,39 (2.0) = 3.5 wks | £2,100 | Age 40/41 transition boundary |
| **BVA-SRP-07** | 50 | 120 months (10 yrs) | £600 | GB | 10 yrs × 1.5 = 15.0 weeks × £600 | £9,000 | Upper band (41+) |
| **BVA-SRP-08** | 50 | 120 months (10 yrs) | £750 | GB | 10 yrs × 1.5 = 15.0 weeks × £750 | £11,250 | Just below GB weekly cap (£751) |
| **BVA-SRP-09** | 50 | 120 months (10 yrs) | £751 | GB | 10 yrs × 1.5 = 15.0 weeks × £751 | £11,265 | Exact GB weekly cap (£751) |
| **BVA-SRP-10** | 50 | 120 months (10 yrs) | £850 | GB | 10 yrs × 1.5 = 15.0 weeks × £751 (capped) | £11,265 | Above GB weekly cap (£751) |
| **BVA-SRP-11** | 55 | 240 months (20 yrs) | £800 | GB | 20 yrs × 1.5 = 30.0 weeks × £751 (capped) | £22,530 | Max statutory service cap (20 yrs) |
| **BVA-SRP-12** | 56 | 264 months (22 yrs) | £800 | GB | 20 yrs (capped) × 1.5 × £751 = 30 wks × £751 | £22,530 | Service exceeding 20-year cap |
| **BVA-SRP-13** | 55 | 240 months (20 yrs) | £800 | NI | 20 yrs × 1.5 = 30.0 weeks × £783 (capped) | £23,490 | Northern Ireland cap (£783/wk) |

---

## 2. Statutory Notice Pay Boundary Matrix (ERA 1996 s.86)

| Test ID | Continuous Service | Contractual Notice | Expected Statutory Weeks | Expected Weeks Used |
| :--- | :--- | :---: | :---: | :---: |
| **BVA-NOT-01** | 0 months (< 1 month) | 0 weeks | 0 weeks | 0 weeks |
| **BVA-NOT-02** | 1 month | 0 weeks | 1 week | 1 week |
| **BVA-NOT-03** | 23 months (< 2 yrs) | 0 weeks | 1 week | 1 week |
| **BVA-NOT-04** | 24 months (2 yrs) | 0 weeks | 2 weeks | 2 weeks |
| **BVA-NOT-05** | 60 months (5 yrs) | 0 weeks | 5 weeks | 5 weeks |
| **BVA-NOT-06** | 144 months (12 yrs) | 0 weeks | 12 weeks | 12 weeks |
| **BVA-NOT-07** | 180 months (15 yrs) | 0 weeks | 12 weeks (capped) | 12 weeks |
| **BVA-NOT-08** | 24 months (2 yrs) | 4 weeks | 2 weeks | 4 weeks (Contractual greater) |

---

## 3. Tax & Marginal Rate Boundary Matrix

| Test ID | Annual Salary (£) | Marginal Tax Rate Band | Personal Allowance Effect |
| :--- | :---: | :---: | :--- |
| **BVA-TAX-01** | £25,000 | 20% | Standard Personal Allowance |
| **BVA-TAX-02** | £50,270 | 20% | Upper boundary of Basic Rate |
| **BVA-TAX-03** | £50,271 | 40% | Lower boundary of Higher Rate |
| **BVA-TAX-04** | £100,000 | 40% | Start of Personal Allowance Tapering |
| **BVA-TAX-05** | £110,000 | 60% | 60% Tax Trap (£1 allowance lost per £2 earned) |
| **BVA-TAX-06** | £125,140 | 60% | End of Personal Allowance Tapering |
| **BVA-TAX-07** | £125,141 | 45% | Additional Rate (Personal Allowance = £0) |
