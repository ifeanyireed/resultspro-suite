import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class StudentManagementPage extends StatelessWidget {
  const StudentManagementPage({super.key});

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
        title: const Text('Student Management', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
        actions: [
          IconButton(icon: const Icon(Icons.person_add_alt_1_outlined, color: AppColors.skyBlue), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          // Enrollment Stats
          Padding(
            padding: const EdgeInsets.all(24),
            child: Row(
              children: [
                Expanded(child: _buildStatCard('Total', '1,240', Colors.blue)),
                const SizedBox(width: 12),
                Expanded(child: _buildStatCard('Active', '1,195', Colors.green)),
                const SizedBox(width: 12),
                Expanded(child: _buildStatCard('Pending', '45', Colors.orange)),
              ],
            ),
          ),
          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
              child: const TextField(
                decoration: InputDecoration(
                  hintText: 'Search students...',
                  border: InputBorder.none,
                  icon: Icon(Icons.search, size: 20),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          // Student List
          Expanded(
            child: ListView.builder(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 24),
              itemCount: 10,
              itemBuilder: (context, index) {
                return _buildStudentTile('Student Name ${index + 1}', 'Grade ${8 - (index % 3)}', 'ID: STU20240${index + 10}');
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))]),
      child: Column(
        children: [
          Text(title, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5), fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: color)),
        ],
      ),
    );
  }

  Widget _buildStudentTile(String name, String grade, String id) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))]),
      child: Row(
        children: [
          const CircleAvatar(backgroundColor: Color(0xFFEBF1FA), child: Icon(Icons.person, color: AppColors.darkBlue)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                Text('$grade • $id', style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Colors.grey),
        ],
      ),
    );
  }
}
