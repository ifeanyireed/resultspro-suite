import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class NotificationsPage extends StatelessWidget {
  const NotificationsPage({super.key});

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
        title: const Text(
          'Notifications',
          style: TextStyle(
            color: AppColors.darkBlue,
            fontSize: 18,
            fontWeight: FontWeight.w900,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {},
            child: const Text(
              'Mark all read',
              style: TextStyle(color: AppColors.skyBlue, fontWeight: FontWeight.bold, fontSize: 13),
            ),
          ),
        ],
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        children: [
          _buildDateHeader('Today'),
          _buildNotificationItem(
            title: 'New Grade Posted!',
            message: 'Your biology lab report has been graded. You scored an A! Keep up the great work.',
            time: '10:30 AM',
            isUnread: true,
            icon: Icons.workspace_premium_outlined,
            iconColor: Colors.orange,
            avatarAsset: 'assets/images/monster_winner.png',
          ),
          const SizedBox(height: 12),
          _buildNotificationItem(
            title: 'Science Fair Tomorrow',
            message: 'Don\'t forget to bring your project board to the main hall by 8:00 AM.',
            time: '08:15 AM',
            isUnread: true,
            icon: Icons.science_outlined,
            iconColor: Colors.purple,
            avatarAsset: 'assets/images/monster_surprised.png',
          ),

          const SizedBox(height: 24),
          _buildDateHeader('Yesterday'),
          _buildNotificationItem(
            title: 'Library Book Due',
            message: '"Advanced Physics" is due tomorrow. Please return it to the library to avoid fines.',
            time: '02:45 PM',
            isUnread: false,
            icon: Icons.menu_book_outlined,
            iconColor: Colors.blue,
            avatarAsset: 'assets/images/monster_studying.png',
          ),
          const SizedBox(height: 12),
          _buildNotificationItem(
            title: 'Fee Payment Received',
            message: 'Your term fee payment has been successfully processed. Thank you!',
            time: '09:00 AM',
            isUnread: false,
            icon: Icons.payments_outlined,
            iconColor: Colors.green,
            avatarAsset: 'assets/images/monster_love.png',
          ),
        ],
      ),
    );
  }

  Widget _buildDateHeader(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16, top: 8),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w900,
          color: AppColors.darkBlue.withOpacity(0.5),
        ),
      ),
    );
  }

  Widget _buildNotificationItem({
    required String title,
    required String message,
    required String time,
    required bool isUnread,
    required IconData icon,
    required Color iconColor,
    required String avatarAsset,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isUnread ? Colors.white : Colors.white.withOpacity(0.6),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isUnread ? AppColors.skyBlue.withOpacity(0.3) : Colors.transparent,
          width: 1.5,
        ),
        boxShadow: isUnread
            ? [
                BoxShadow(
                  color: AppColors.skyBlue.withOpacity(0.05),
                  blurRadius: 15,
                  offset: const Offset(0, 5),
                )
              ]
            : [],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Avatar / Icon
          Stack(
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Image.asset(avatarAsset, height: 35, fit: BoxFit.contain),
                ),
              ),
              if (isUnread)
                Positioned(
                  top: 0,
                  right: 0,
                  child: Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: AppColors.skyBlue,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 16),
          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: isUnread ? FontWeight.w900 : FontWeight.bold,
                          color: AppColors.darkBlue,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Text(
                      time,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isUnread ? AppColors.skyBlue : AppColors.darkBlue.withOpacity(0.4),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  message,
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.4,
                    color: AppColors.darkBlue.withOpacity(0.6),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
