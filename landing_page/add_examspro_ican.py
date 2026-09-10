import re

with open('src/components/ProductPricingSection.tsx', 'r') as f:
    content = f.read()

# Update productTypes array
content = content.replace(
    "const productTypes = ['ClassroomPRO', 'PuzzlePRO', 'CoursesPRO', 'TutorsPRO'];",
    "const productTypes = ['ExamsPRO', 'ICAN', 'ClassroomPRO', 'PuzzlePRO', 'CoursesPRO', 'TutorsPRO'];"
)

# I need to insert ExamsPRO and ICAN into productPlans
# I will insert them right after `const productPlans = {`

examspro_and_ican_blocks = """  ExamsPRO: [
    {
      name: 'STARTER',
      price: '₦5,000',
      period: 'per month',
      features: ['Up to 500 Students', 'Standard CBT System', 'Basic Question Bank', 'Email Support'],
      cta: 'Start with Starter',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦15,000',
      period: 'per month',
      features: ['Unlimited Students', 'Advanced Anti-cheat', 'Custom Question Banks', 'Priority Support'],
      cta: 'Upgrade to Pro',
      highlight: true
    },
    {
      name: 'ENTERPRISE',
      price: '₦50,000',
      period: 'per month',
      features: ['Unlimited Students', 'Custom Domain', 'White-labeling', 'Dedicated Support'],
      cta: 'Contact Sales',
      highlight: false
    }
  ],
  ICAN: [
    {
      name: 'SINGLE PAPER',
      price: '₦3,000',
      period: 'per month',
      features: ['Access to 1 ICAN Paper', 'Past Questions Access', 'AI Tutor Guidance', 'Email Support'],
      cta: 'Buy Single Paper',
      highlight: false
    },
    {
      name: 'COMPLETE LEVEL',
      price: '₦7,000',
      period: 'per month',
      features: ['Access to 1 Complete Level', 'All Papers in Level', 'AI Tutor Guidance', 'Priority Support'],
      cta: 'Buy Complete Level',
      highlight: true
    },
    {
      name: 'FULL DIET ACCESS',
      price: '₦10,000',
      period: 'per month',
      features: ['Unlimited ICAN Levels', 'Unlimited Papers', 'Advanced AI Insights', 'Priority Support'],
      cta: 'Get Full Access',
      highlight: false
    }
  ],"""

content = content.replace(
    "const productPlans = {",
    "const productPlans = {\n" + examspro_and_ican_blocks
)

with open('src/components/ProductPricingSection.tsx', 'w') as f:
    f.write(content)
