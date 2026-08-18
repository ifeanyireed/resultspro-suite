import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';
import '../widgets/settings_modals.dart';
import 'child_profile_page.dart';

class ProfilePage extends StatelessWidget {
  final String role;
  
  const ProfilePage({super.key, this.role = 'Student'});

  @override
  Widget build(BuildContext context) {
    String name = 'James Dean';
    String avatar = 'assets/images/photo11.jpeg';
    
    if (role == 'Parent') {
      name = 'Mr. Smith';
      avatar = 'assets/images/photo12.jpeg';
    } else if (role == 'Teacher') {
      name = 'Mrs. Grace';
      avatar = 'assets/images/photo09.jpeg';
    } else if (role == 'School Admin') {
      name = 'Administrator';
      avatar = 'assets/images/photo01.jpeg';
    }

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
        title: const Text(
          'Profile',
          style: TextStyle(
            color: AppColors.darkBlue,
            fontSize: 18,
            fontWeight: FontWeight.w900,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_outlined, color: Colors.redAccent),
            onPressed: () {
              // TODO: Implement Logout
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User Details
            ScrollReveal(
              child: Center(
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.skyBlue.withOpacity(0.2),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: CircleAvatar(
                        radius: 50,
                        backgroundImage: AssetImage(avatar),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      name,
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.darkBlue),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.skyBlue.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        role.toUpperCase(),
                        style: const TextStyle(color: AppColors.skyBlue, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'contact@example.com  •  +1 234 567 8900',
                      style: TextStyle(fontSize: 13, color: AppColors.darkBlue.withOpacity(0.5), fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 32),

            // Linked Children (Only for Parents)
            if (role == 'Parent') ...[
              const Text(
                'Linked Children',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue),
              ),
              const SizedBox(height: 16),
              ScrollReveal(
                delay: const Duration(milliseconds: 100),
                child: Row(
                  children: [
                    Expanded(child: _buildLinkedChildCard('Sarah Smith', 'Grade 8', 'assets/images/photo10.jpeg')),
                    const SizedBox(width: 16),
                    Expanded(child: _buildLinkedChildCard('Tom Smith', 'Grade 5', 'assets/images/photo11.jpeg')),
                  ],
                ),
              ),
              const SizedBox(height: 32),
            ],

            // Linked Schools
            const Text(
              'Linked Schools',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue),
            ),
            const SizedBox(height: 16),
            ScrollReveal(
              delay: const Duration(milliseconds: 200),
              child: _buildSchoolCard(),
            ),

            const SizedBox(height: 32),

            // Settings
            const Text(
              'Settings',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue),
            ),
            const SizedBox(height: 16),
            ScrollReveal(
              delay: const Duration(milliseconds: 300),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.02),
                      blurRadius: 15,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    _buildSettingsTile(Icons.person_outline, 'Personal Information', onTap: () => SettingsModals.showPersonalInformationModal(context)),
                    const Divider(height: 1, indent: 56),
                    _buildSettingsTile(Icons.notifications_outlined, 'Notifications & Sounds', onTap: () => SettingsModals.showNotificationsModal(context)),
                    const Divider(height: 1, indent: 56),
                    _buildSettingsTile(Icons.lock_outline, 'Privacy & Security', onTap: () => SettingsModals.showPrivacyModal(context)),
                    const Divider(height: 1, indent: 56),
                    _buildSettingsTile(Icons.language_outlined, 'Language & Region', onTap: () => SettingsModals.showLanguageModal(context)),
                    const Divider(height: 1, indent: 56),
                    _buildSettingsTile(Icons.help_outline, 'Help & Support', isLast: true, onTap: () => SettingsModals.showHelpModal(context)),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildLinkedChildCard(String name, String grade, String imagePath) {
    return Builder(
      builder: (context) {
        return InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => ChildProfilePage(
                  name: name,
                  grade: grade,
                  imagePath: imagePath,
                ),
              ),
            );
          },
          borderRadius: BorderRadius.circular(20),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundImage: AssetImage(imagePath),
                ),
                const SizedBox(height: 12),
                Text(
                  name,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.darkBlue),
                ),
                const SizedBox(height: 4),
                Text(
                  grade,
                  style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5), fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        );
      }
    );
  }

  Widget _buildSchoolCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: AppColors.skyBlue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(Icons.school_outlined, color: AppColors.skyBlue, size: 32),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Greenwood High School',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkBlue),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.location_on_outlined, size: 14, color: AppColors.darkBlue.withOpacity(0.5)),
                    const SizedBox(width: 4),
                    Text(
                      '123 Education Lane, NY',
                      style: TextStyle(fontSize: 13, color: AppColors.darkBlue.withOpacity(0.5), fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Icon(Icons.chevron_right, color: AppColors.darkBlue.withOpacity(0.3)),
        ],
      ),
    );
  }

  Widget _buildSettingsTile(IconData icon, String title, {bool isLast = false, VoidCallback? onTap}) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.darkBlue.withOpacity(0.05),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: AppColors.darkBlue, size: 20),
      ),
      title: Text(
        title,
        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.darkBlue),
      ),
      trailing: Icon(Icons.chevron_right, color: AppColors.darkBlue.withOpacity(0.3)),
      shape: RoundedRectangleBorder(
        borderRadius: isLast ? const BorderRadius.vertical(bottom: Radius.circular(24)) : BorderRadius.zero,
      ),
      onTap: onTap,
    );
  }
}
