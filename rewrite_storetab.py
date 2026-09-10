import re

with open('admin/src/app/(dashboard)/exampro/tabs/StoreTab.tsx', 'r') as f:
    content = f.read()

old_imports = """  fetchExamproStorePacks, 
  createExamproStorePack, 
  updateExamproStorePack, 
  deleteExamproStorePack """
new_imports = """  fetchExamproStorePacks, 
  createExamproStorePack, 
  updateExamproStorePack, 
  deleteExamproStorePack,
  fetchExamproPlans,
  createExamproPlan,
  updateExamproPlan,
  deleteExamproPlan"""
content = content.replace(old_imports, new_imports)

old_state = """  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<any>(null);

  const [formData, setFormData] = useState({"""

new_state = """  const [packs, setPacks] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeView, setActiveView] = useState<'COIN' | 'PLAN'>('COIN');

  const [formData, setFormData] = useState({"""
content = content.replace(old_state, new_state)
