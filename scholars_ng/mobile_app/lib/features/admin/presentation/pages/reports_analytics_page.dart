import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class ReportsAnalyticsPage extends StatelessWidget {
  const ReportsAnalyticsPage({super.key});

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
        title: const Text('Reports & Analytics', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(24),
        children: [
          _buildReportSection('Academic Reports', [
            'Class Performance Summary',
            'Subject Analysis Report',
            'Teacher Performance Metrics',
          ], Icons.auto_graph, Colors.blue),
          const SizedBox(height: 24),
          _buildReportSection('Enrollment Reports', [
            'Lead Conversion Funnel',
            'New Admissions 2024',
            'Withdrawal Analysis',
          ], Icons.person_add_outlined, Colors.purple),
          const SizedBox(height: 24),
          _buildReportSection('Revenue Reports', [
            'Fee Collection Summary',
            'Outstanding Dues Tracker',
            'Discount & Scholarship Usage',
          ], Icons.payments_outlined, Colors.green),
        ],
      ),
    );
  }

  Widget _buildReportSection(String title, List<String> reports, IconData icon, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(width: 12),
            Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))]),
          child: Column(
            children: reports.map((report) => _buildReportTile(report)).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildReportTile(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(child: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.darkBlue))),
          const Icon(Icons.download_outlined, size: 20, color: AppColors.skyBlue),
        ],
      ),
    );
  }
}
