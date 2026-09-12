with open('examspro/src/app/shop/page.tsx', 'r') as f:
    content = f.read()

target = """  const fetchCoinPacks = async () => {
    try {
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
      const res = await fetch(`${USERS_API}/api/v1/billing/plans`);
      const data = await res.json();
      let packsRaw = data.plans || data || [];
      
      if (!Array.isArray(packsRaw)) {
        if (packsRaw && Array.isArray(packsRaw.packs)) packsRaw = packsRaw.packs;
        else if (packsRaw && Array.isArray(packsRaw.data)) packsRaw = packsRaw.data;
        else packsRaw = [];
      }
      
      // Adapt the models so it fits the UI's expected schema
      const mappedPacks = packsRaw.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.monthly_price || p.price || 0,
        type: p.category === 'ICAN' ? 'ICAN' : (p.category === 'COIN' ? 'COIN' : p.category),
        popular: p.highlight,
        color: 'blue',
        access_level: p.access_level
      }));
      setAllPacks(mappedPacks);
    } catch (err) {
      console.error('Failed to fetch coin packs:', err);
      setAllPacks([]);
    } finally {
      setLoadingPacks(false);
    }
  };"""

replacement = """  const fetchCoinPacks = async () => {
    try {
      const EXAMS_API = process.env.NEXT_PUBLIC_EXAMS_API || 'https://resultspro-service-examspro.onrender.com';
      const res = await fetch(`${EXAMS_API}/api/payment/packs`);
      const packsRaw = await res.json();
      
      if (Array.isArray(packsRaw)) {
        // Adapt the models so it fits the UI's expected schema
        const mappedPacks = packsRaw.map((p: any) => ({
          id: p.id,
          name: p.name,
          coins: p.coins,
          price: p.price || 0,
          type: p.type || 'COIN',
          popular: p.popular,
          color: p.color || 'blue',
          discount: p.discount,
          bonus: p.bonus,
          description: p.description
        }));
        setAllPacks(mappedPacks);
      } else {
        setAllPacks([]);
      }
    } catch (err) {
      console.error('Failed to fetch coin packs:', err);
      setAllPacks([]);
    } finally {
      setLoadingPacks(false);
    }
  };"""

if target in content:
    with open('examspro/src/app/shop/page.tsx', 'w') as f:
        f.write(content.replace(target, replacement))
    print("Patched successfully")
else:
    print("Target block not found")
