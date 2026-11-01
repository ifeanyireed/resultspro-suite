import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class AssignmentsPage extends StatefulWidget {
  final bool isTab;
  const AssignmentsPage({super.key, this.isTab = false});

  @override
  State<AssignmentsPage> createState() => _AssignmentsPageState();
}

class _AssignmentsPageState extends State<AssignmentsPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEBF1FA),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: !widget.isTab,
        leading: widget.isTab ? null : IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.darkBlue, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Assignments', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
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
                Tab(text: 'Pending'),
                Tab(text: 'Submitted'),
                Tab(text: 'Graded'),
              ],
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildList([
            _buildAssignmentCard('Math Assignment #5', 'Mathematics • Due tomorrow', 'Pending', Colors.orange, Icons.warning_amber_rounded),
            _buildAssignmentCard('Biology Lab Report', 'Biology • Due in 3 days', 'Pending', Colors.orange, Icons.schedule),
          ]),
          _buildList([
            _buildAssignmentCard('History Essay', 'History • Submitted yesterday', 'Submitted', Colors.blue, Icons.check_circle_outline),
          ]),
          _buildList([
            _buildAssignmentCard('Physics Worksheet', 'Physics • Graded', 'A (95%)', Colors.green, Icons.grade),
            _buildAssignmentCard('English Book Review', 'English • Graded', 'B+ (88%)', Colors.green, Icons.grade),
          ]),
        ],
      ),
    );
  }

  Widget _buildList(List<Widget> children) {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      physics: const BouncingScrollPhysics(),
      children: children.map((child) => Padding(padding: const EdgeInsets.only(bottom: 16), child: ScrollReveal(child: child))).toList(),
    );
  }

  Widget _buildAssignmentCard(String title, String subtitle, String status, Color statusColor, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: statusColor.withOpacity(0.1), shape: BoxShape.circle),
            child: Icon(icon, color: statusColor, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                const SizedBox(height: 4),
                Text(subtitle, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
              ],
            ),
          ),
          Text(status, style: TextStyle(color: statusColor, fontSize: 13, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
