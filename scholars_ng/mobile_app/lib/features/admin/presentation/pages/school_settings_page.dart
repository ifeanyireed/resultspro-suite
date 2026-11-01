import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class SchoolSettingsPage extends StatelessWidget {
  const SchoolSettingsPage({super.key});

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
        title: const Text('School Settings', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(24),
        children: [
          _buildSettingsTile('School Branding', 'Logo, Colors, Theme', Icons.palette_outlined),
          _buildSettingsTile('Domain & Website', 'Custom domain, Portal link', Icons.language_outlined),
          _buildSettingsTile('Permissions & Roles', 'Staff access control', Icons.security_outlined),
          _buildSettingsTile('Integrations', 'Payments, SMS Gateways', Icons.integration_instructions_outlined),
          _buildSettingsTile('Data Export & Backup', 'Download school data', Icons.backup_outlined),
          const SizedBox(height: 40),
          Center(
            child: Text('Version 1.0.0 (Enterprise)', style: TextStyle(color: AppColors.darkBlue.withOpacity(0.3), fontSize: 12, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsTile(String title, String subtitle, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))]),
      child: Row(
        children: [
          Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: AppColors.skyBlue.withOpacity(0.1), shape: BoxShape.circle), child: Icon(icon, color: AppColors.skyBlue)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                Text(subtitle, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Colors.grey),
        ],
      ),
    );
  }
}
