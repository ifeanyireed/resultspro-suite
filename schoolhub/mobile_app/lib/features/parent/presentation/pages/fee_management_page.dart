import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class FeeManagementPage extends StatefulWidget {
  final bool isTab;
  const FeeManagementPage({super.key, this.isTab = false});

  @override
  State<FeeManagementPage> createState() => _FeeManagementPageState();
}

class _FeeManagementPageState extends State<FeeManagementPage> {
  bool _isNaira = false;

  String _formatAmount(double usdAmount) {
    if (_isNaira) {
      // Assuming conversion rate 1 USD = 1200 NGN
      final ngnAmount = usdAmount * 1200;
      // Simple formatting with commas (e.g. 1,500,000)
      final formatted = ngnAmount.toStringAsFixed(0).replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},');
      return '₦$formatted';
    } else {
      final formatted = usdAmount.toStringAsFixed(2).replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},');
      return '\$$formatted';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEBF1FA),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: !widget.isTab,
        leading: widget.isTab ? null : IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.darkBlue, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Fee Management',
          style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Center(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.darkBlue.withOpacity(0.1)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    GestureDetector(
                      onTap: () => setState(() => _isNaira = false),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: !_isNaira ? AppColors.skyBlue : Colors.transparent,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          '\$',
                          style: TextStyle(
                            color: !_isNaira ? Colors.white : AppColors.darkBlue,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => setState(() => _isNaira = true),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: _isNaira ? AppColors.skyBlue : Colors.transparent,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          '₦',
                          style: TextStyle(
                            color: _isNaira ? Colors.white : AppColors.darkBlue,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Outstanding Balance Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.skyBlue, Color(0xFF0052CC)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: AppColors.skyBlue.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Total Outstanding Balance', style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 14, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(_formatAmount(1250.00), style: const TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: AppColors.skyBlue,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: const Text('Pay Now', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Invoices
            const Text('Pending Invoices', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            _buildInvoiceCard('Term 2 Tuition Fee', 'Sarah Smith', _formatAmount(800.00), 'Due in 5 days', true),
            const SizedBox(height: 12),
            _buildInvoiceCard('Bus Transportation', 'Tom Smith', _formatAmount(450.00), 'Due in 12 days', true),
            
            const SizedBox(height: 32),
            
            // Payment History
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Payment History', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
                Text('View all', style: TextStyle(fontSize: 13, color: AppColors.skyBlue.withOpacity(0.8), fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 16),
            _buildInvoiceCard('Term 1 Tuition Fee', 'Sarah Smith', _formatAmount(800.00), 'Paid Oct 10, 2023', false),
            const SizedBox(height: 12),
            _buildInvoiceCard('Extracurricular: Coding', 'Tom Smith', _formatAmount(150.00), 'Paid Sep 28, 2023', false),
          ],
        ),
      ),
    );
  }

  Widget _buildInvoiceCard(String title, String student, String amount, String status, bool isPending) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isPending ? Colors.orange.withOpacity(0.3) : Colors.transparent, width: 1.5),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isPending ? Colors.orange.withOpacity(0.1) : Colors.green.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(isPending ? Icons.receipt_long_outlined : Icons.check_circle_outline, 
                       color: isPending ? Colors.orange : Colors.green, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                const SizedBox(height: 4),
                Text('$student • $status', style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
              ],
            ),
          ),
          Text(amount, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
        ],
      ),
    );
  }
}
