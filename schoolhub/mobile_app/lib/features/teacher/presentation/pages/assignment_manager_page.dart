import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class AssignmentManagerPage extends StatefulWidget {
  const AssignmentManagerPage({super.key});

  @override
  State<AssignmentManagerPage> createState() => _AssignmentManagerPageState();
}

class _AssignmentManagerPageState extends State<AssignmentManagerPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEBF1FA),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.darkBlue, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Assignment Manager', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(30)),
            child: TabBar(
              controller: _tabController,
              indicator: BoxDecoration(borderRadius: BorderRadius.circular(26), color: AppColors.skyBlue),
              labelColor: Colors.white,
              unselectedLabelColor: AppColors.darkBlue.withOpacity(0.5),
              labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              tabs: const [
                Tab(text: 'Active'),
                Tab(text: 'Review'),
              ],
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildActiveList(),
          _buildReviewList(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: AppColors.skyBlue,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildActiveList() {
    return ListView(
      padding: const EdgeInsets.all(24),
      physics: const BouncingScrollPhysics(),
      children: [
        _buildAssignmentCard('Quadratic Equations', 'Grade 8A • Due in 2 days', '12/32 Submitted', Colors.blue),
        const SizedBox(height: 16),
        _buildAssignmentCard('Chemical Bonding', 'Grade 9B • Due in 4 days', '5/28 Submitted', Colors.green),
      ],
    );
  }

  Widget _buildReviewList() {
    return ListView(
      padding: const EdgeInsets.all(24),
      physics: const BouncingScrollPhysics(),
      children: [
        _buildAssignmentCard('Linear Equations', 'Grade 8A • Closed', '32/32 Submissions', Colors.orange, isReview: true),
        const SizedBox(height: 16),
        _buildAssignmentCard('Atomic Structure', 'Grade 9B • Closed', '28/28 Submissions', Colors.purple, isReview: true),
      ],
    );
  }

  Widget _buildAssignmentCard(String title, String subtitle, String stats, Color color, {bool isReview = false}) {
    return ScrollReveal(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))]),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                  const SizedBox(height: 4),
                  Text(subtitle, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(Icons.people_outline, size: 14, color: color),
                      const SizedBox(width: 4),
                      Text(stats, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: color)),
                    ],
                  ),
                ],
              ),
            ),
            if (isReview)
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.skyBlue.withOpacity(0.1), foregroundColor: AppColors.skyBlue, elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                child: const Text('Grade'),
              )
            else
              const Icon(Icons.edit_outlined, color: Colors.grey, size: 20),
          ],
        ),
      ),
    );
  }
}
