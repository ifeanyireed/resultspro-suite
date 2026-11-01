import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class StaffManagementPage extends StatelessWidget {
  const StaffManagementPage({super.key});

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
        title: const Text('Staff Management', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
        actions: [
          IconButton(icon: const Icon(Icons.person_add_outlined, color: AppColors.skyBlue), onPressed: () {}),
        ],
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(24),
        children: [
          const Text('Roles', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
          const SizedBox(height: 16),
          _buildRoleCard('Teachers', '48 Active', Icons.school_outlined, Colors.blue),
          const SizedBox(height: 12),
          _buildRoleCard('Administrative', '12 Active', Icons.admin_panel_settings_outlined, Colors.purple),
          const SizedBox(height: 12),
          _buildRoleCard('Support Staff', '24 Active', Icons.engineering_outlined, Colors.orange),
          const SizedBox(height: 32),
          const Text('Recent Staff', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
          const SizedBox(height: 16),
          _buildStaffTile('Mrs. Grace', 'Senior Teacher • Grade 8A', 'assets/images/photo09.jpeg'),
          const SizedBox(height: 12),
          _buildStaffTile('Mr. John', 'Admissions Officer', 'assets/images/photo11.jpeg'),
        ],
      ),
    );
  }

  Widget _buildRoleCard(String title, String count, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))]),
      child: Row(
        children: [
          Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle), child: Icon(icon, color: color)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                Text(count, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Colors.grey),
        ],
      ),
    );
  }

  Widget _buildStaffTile(String name, String role, String avatar) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))]),
      child: Row(
        children: [
          CircleAvatar(radius: 20, backgroundImage: AssetImage(avatar)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                Text(role, style: TextStyle(fontSize: 11, color: AppColors.darkBlue.withOpacity(0.5))),
              ],
            ),
          ),
          const Icon(Icons.email_outlined, size: 18, color: AppColors.skyBlue),
        ],
      ),
    );
  }
}
