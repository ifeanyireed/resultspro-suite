import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import 'chat_page.dart';

class NewChatPage extends StatelessWidget {
  const NewChatPage({super.key});

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
        title: const Text('New Message', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            child: Container(
              height: 48,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 15, offset: const Offset(0, 5)),
                ],
              ),
              child: TextField(
                decoration: InputDecoration(
                  hintText: 'Search teachers or admins...',
                  hintStyle: TextStyle(color: AppColors.darkBlue.withOpacity(0.3), fontSize: 14),
                  prefixIcon: Icon(Icons.search, color: AppColors.darkBlue.withOpacity(0.3), size: 20),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          
          // Contacts List
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            child: Text('Suggested Contacts', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
          ),
          Expanded(
            child: ListView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 24),
              children: [
                _buildContactRow(context, 'Mrs. Grace', 'Mathematics Teacher', 'assets/images/photo09.jpeg'),
                _buildContactRow(context, 'Mr. Johnson', 'History Teacher', 'assets/images/photo01.jpeg'),
                _buildContactRow(context, 'Coach Davis', 'Physical Education', 'assets/images/photo11.jpeg'),
                _buildContactRow(context, 'Admin Office', 'School Administration', 'assets/images/logo.png'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactRow(BuildContext context, String name, String role, String avatarPath) {
    return InkWell(
      onTap: () {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => ChatPage(
              contactName: name,
              contactRole: role,
              avatarPath: avatarPath,
            ),
          ),
        );
      },
      borderRadius: BorderRadius.circular(20),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 5))],
        ),
        child: Row(
          children: [
            CircleAvatar(radius: 24, backgroundImage: AssetImage(avatarPath)),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                  const SizedBox(height: 4),
                  Text(role, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
                ],
              ),
            ),
            const Icon(Icons.chat_bubble_outline, color: AppColors.skyBlue, size: 20),
          ],
        ),
      ),
    );
  }
}
