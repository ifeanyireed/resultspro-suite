import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class SettingsModals {
  static void showPersonalInformationModal(BuildContext context) {
    _showCustomModal(
      context,
      title: 'Personal Information',
      icon: Icons.person_outline,
      child: Column(
        children: [
          _buildTextField(label: 'Full Name', initialValue: 'James Dean'),
          const SizedBox(height: 16),
          _buildTextField(label: 'Email Address', initialValue: 'contact@example.com'),
          const SizedBox(height: 16),
          _buildTextField(label: 'Phone Number', initialValue: '+1 234 567 8900'),
          const SizedBox(height: 24),
          _buildSaveButton(context),
        ],
      ),
    );
  }

  static void showNotificationsModal(BuildContext context) {
    _showCustomModal(
      context,
      title: 'Notifications & Sounds',
      icon: Icons.notifications_outlined,
      child: Column(
        children: [
          _buildSwitchTile(title: 'Push Notifications', subtitle: 'Receive alerts on your device', initialValue: true),
          const Divider(height: 1),
          _buildSwitchTile(title: 'Email Notifications', subtitle: 'Receive daily summaries', initialValue: false),
          const Divider(height: 1),
          _buildSwitchTile(title: 'Sound', subtitle: 'Play sound for notifications', initialValue: true),
          const SizedBox(height: 24),
          _buildSaveButton(context),
        ],
      ),
    );
  }

  static void showPrivacyModal(BuildContext context) {
    _showCustomModal(
      context,
      title: 'Privacy & Security',
      icon: Icons.lock_outline,
      child: Column(
        children: [
          _buildTextField(label: 'Current Password', isPassword: true),
          const SizedBox(height: 16),
          _buildTextField(label: 'New Password', isPassword: true),
          const SizedBox(height: 16),
          _buildTextField(label: 'Confirm New Password', isPassword: true),
          const SizedBox(height: 24),
          _buildSaveButton(context),
        ],
      ),
    );
  }

  static void showLanguageModal(BuildContext context) {
    _showCustomModal(
      context,
      title: 'Language & Region',
      icon: Icons.language_outlined,
      child: Column(
        children: [
          _buildDropdownTile(title: 'Language', value: 'English (US)'),
          const SizedBox(height: 16),
          _buildDropdownTile(title: 'Time Zone', value: 'Eastern Time (ET)'),
          const SizedBox(height: 24),
          _buildSaveButton(context),
        ],
      ),
    );
  }

  static void showHelpModal(BuildContext context) {
    _showCustomModal(
      context,
      title: 'Help & Support',
      icon: Icons.help_outline,
      child: Column(
        children: [
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: AppColors.skyBlue.withOpacity(0.1), shape: BoxShape.circle),
              child: const Icon(Icons.email_outlined, color: AppColors.skyBlue, size: 20),
            ),
            title: const Text('Contact Support', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
            subtitle: Text('support@schoolhub.com', style: TextStyle(color: AppColors.darkBlue.withOpacity(0.5), fontSize: 12)),
          ),
          const SizedBox(height: 12),
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), shape: BoxShape.circle),
              child: const Icon(Icons.article_outlined, color: Colors.green, size: 20),
            ),
            title: const Text('FAQs', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
            subtitle: Text('Read our frequently asked questions', style: TextStyle(color: AppColors.darkBlue.withOpacity(0.5), fontSize: 12)),
          ),
        ],
      ),
    );
  }

  // --- Helper Methods for Modals ---

  static void _showCustomModal(BuildContext context, {required String title, required IconData icon, required Widget child}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Drag handle
                Center(
                  child: Container(
                    width: 40,
                    height: 5,
                    decoration: BoxDecoration(
                      color: AppColors.darkBlue.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                // Header
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.skyBlue.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(icon, color: AppColors.skyBlue, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Text(
                      title,
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkBlue),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                // Content
                child,
                const SizedBox(height: 16),
              ],
            ),
          ),
        );
      },
    );
  }

  static Widget _buildTextField({required String label, String? initialValue, bool isPassword = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(fontSize: 13, color: AppColors.darkBlue.withOpacity(0.7), fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        TextFormField(
          initialValue: initialValue,
          obscureText: isPassword,
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.darkBlue),
          decoration: InputDecoration(
            filled: true,
            fillColor: AppColors.darkBlue.withOpacity(0.03),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
      ],
    );
  }

  static Widget _buildSwitchTile({required String title, required String subtitle, required bool initialValue}) {
    return StatefulBuilder(
      builder: (context, setState) {
        return SwitchListTile(
          value: initialValue,
          onChanged: (val) => setState(() => initialValue = val),
          title: Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
          subtitle: Text(subtitle, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
          activeColor: AppColors.skyBlue,
          contentPadding: EdgeInsets.zero,
        );
      },
    );
  }

  static Widget _buildDropdownTile({required String title, required String value}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(fontSize: 13, color: AppColors.darkBlue.withOpacity(0.7), fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          decoration: BoxDecoration(
            color: AppColors.darkBlue.withOpacity(0.03),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                value,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.darkBlue),
              ),
              const Icon(Icons.expand_more_rounded, color: AppColors.darkBlue),
            ],
          ),
        ),
      ],
    );
  }

  static Widget _buildSaveButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: () => Navigator.pop(context),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.skyBlue,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 4,
          shadowColor: AppColors.skyBlue.withOpacity(0.4),
        ),
        child: const Text('Save Changes', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1)),
      ),
    );
  }
}
