import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class SubscriptionBillingPage extends StatelessWidget {
  const SubscriptionBillingPage({super.key});

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
        title: const Text('Subscription & Billing', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Current Plan Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [AppColors.darkBlue, Color(0xFF1A237E)]),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Active Product', style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text('SchoolHub Enterprise', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Usage: 1,240 / 2,000 Students', style: TextStyle(color: Colors.white70, fontSize: 12)),
                      Text('Renews in 12 days', style: TextStyle(color: AppColors.skyBlue.withOpacity(0.8), fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            const Text('Modules Active', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            _buildModuleTile('ResultsPRO', true),
            _buildModuleTile('ExamsPRO', true),
            _buildModuleTile('ClassroomPRO', true),
            _buildModuleTile('ScholarsNG (AI & Coding)', true),
            const SizedBox(height: 32),
            const Text('Recent Invoices', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            _buildInvoiceTile('INV-2024-09', 'Sep 01, 2024', '\$450.00', 'Paid'),
            _buildInvoiceTile('INV-2024-08', 'Aug 01, 2024', '\$450.00', 'Paid'),
          ],
        ),
      ),
    );
  }

  Widget _buildModuleTile(String title, bool isActive) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
          const Icon(Icons.check_circle, color: Colors.green, size: 20),
        ],
      ),
    );
  }

  Widget _buildInvoiceTile(String id, String date, String amount, String status) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(id, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
            Text(date, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
          ]),
          Text(amount, style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
        ],
      ),
    );
  }
}
