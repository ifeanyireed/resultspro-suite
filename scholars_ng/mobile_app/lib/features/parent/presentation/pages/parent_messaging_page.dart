import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class ParentMessagingPage extends StatelessWidget {
  final bool isTab;
  const ParentMessagingPage({super.key, this.isTab = false});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEBF1FA),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: !isTab,
        leading: isTab ? null : IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.darkBlue, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Messaging', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
        actions: [
          IconButton(icon: const Icon(Icons.search, color: AppColors.darkBlue), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          // Custom Tabs
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            child: Row(
              children: [
                Expanded(child: _buildTab('Teachers', true)),
                const SizedBox(width: 12),
                Expanded(child: _buildTab('Admin', false)),
                const SizedBox(width: 12),
                Expanded(child: _buildTab('Admissions', false)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Chat List
          Expanded(
            child: ListView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 24),
              children: [
                _buildChatRow('Mrs. Grace', 'Mathematics Teacher', 'Sarah did great on her quiz today!', '10:30 AM', 2, 'assets/images/photo09.jpeg'),
                const SizedBox(height: 16),
                _buildChatRow('Mr. Johnson', 'History Teacher', 'Please review the attached project details.', 'Yesterday', 0, 'assets/images/photo01.jpeg'),
                const SizedBox(height: 16),
                _buildChatRow('Coach Davis', 'Physical Education', 'Sports meet schedule updated.', 'Mon', 0, 'assets/images/photo11.jpeg'),
                const SizedBox(height: 100), // padding for bottom nav
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: AppColors.skyBlue,
        foregroundColor: Colors.white,
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: const Icon(Icons.edit_outlined, size: 28),
      ),
    );
  }

  Widget _buildTab(String title, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: isSelected ? AppColors.skyBlue : Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: isSelected ? [BoxShadow(color: AppColors.skyBlue.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))] : [],
      ),
      child: Text(
        title,
        style: TextStyle(
          color: isSelected ? Colors.white : AppColors.darkBlue.withOpacity(0.6),
          fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
          fontSize: 13,
        ),
      ),
    );
  }

  Widget _buildChatRow(String name, String role, String message, String time, int unreadCount, String avatarPath) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 5))],
      ),
      child: Row(
        children: [
          CircleAvatar(radius: 26, backgroundImage: AssetImage(avatarPath)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(name, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                    Text(time, style: TextStyle(fontSize: 12, fontWeight: unreadCount > 0 ? FontWeight.bold : FontWeight.normal, color: unreadCount > 0 ? AppColors.skyBlue : Colors.grey)),
                  ],
                ),
                const SizedBox(height: 2),
                Text(role, style: TextStyle(fontSize: 11, color: AppColors.skyBlue.withOpacity(0.8), fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        message,
                        style: TextStyle(fontSize: 13, color: AppColors.darkBlue.withOpacity(unreadCount > 0 ? 0.9 : 0.5), fontWeight: unreadCount > 0 ? FontWeight.w600 : FontWeight.normal),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (unreadCount > 0) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(color: AppColors.skyBlue, shape: BoxShape.circle),
                        child: Text(unreadCount.toString(), style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    ]
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
