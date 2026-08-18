import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class CommunicationCenterPage extends StatelessWidget {
  const CommunicationCenterPage({super.key});

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
        title: const Text('Communication Center', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: GridView.count(
        crossAxisCount: 2,
        padding: const EdgeInsets.all(24),
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        children: [
          _buildCommCard('Send SMS', Icons.sms_outlined, Colors.blue),
          _buildCommCard('Send Email', Icons.email_outlined, Colors.orange),
          _buildCommCard('Push Notification', Icons.notifications_active_outlined, Colors.purple),
          _buildCommCard('Announcements', Icons.campaign_outlined, Colors.green),
        ],
      ),
    );
  }

  Widget _buildCommCard(String title, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))]),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle), child: Icon(icon, color: color, size: 32)),
          const SizedBox(height: 16),
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkBlue, fontSize: 13), textAlign: TextAlign.center),
        ],
      ),
    );
  }
}
