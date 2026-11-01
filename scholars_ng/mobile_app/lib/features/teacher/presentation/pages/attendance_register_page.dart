import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class AttendanceRegisterPage extends StatefulWidget {
  const AttendanceRegisterPage({super.key});

  @override
  State<AttendanceRegisterPage> createState() => _AttendanceRegisterPageState();
}

class _AttendanceRegisterPageState extends State<AttendanceRegisterPage> {
  final List<Map<String, dynamic>> _students = [
    {'name': 'Sarah Smith', 'id': 'STU001', 'isPresent': true, 'avatar': 'assets/images/photo10.jpeg'},
    {'name': 'Tom Smith', 'id': 'STU002', 'isPresent': true, 'avatar': 'assets/images/photo11.jpeg'},
    {'name': 'Alex Johnson', 'id': 'STU003', 'isPresent': false, 'avatar': 'assets/images/photo01.jpeg'},
    {'name': 'Emma Davis', 'id': 'STU004', 'isPresent': true, 'avatar': 'assets/images/photo02.jpeg'},
    {'name': 'John Doe', 'id': 'STU005', 'isPresent': true, 'avatar': 'assets/images/photo03.jpeg'},
  ];

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
        title: const Text('Attendance Register', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
        actions: [
          IconButton(icon: const Icon(Icons.history, color: AppColors.darkBlue), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          // Class & Date Header
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Grade 8A', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
                    Text('Mathematics • Oct 10, 2024', style: TextStyle(fontSize: 14, color: AppColors.skyBlue, fontWeight: FontWeight.bold)),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.skyBlue.withOpacity(0.3))),
                  child: const Text('4/5 Present', style: TextStyle(color: AppColors.skyBlue, fontWeight: FontWeight.bold, fontSize: 12)),
                ),
              ],
            ),
          ),
          // Student List
          Expanded(
            child: ListView.builder(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 24),
              itemCount: _students.length,
              itemBuilder: (context, index) {
                final student = _students[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: ScrollReveal(
                    delay: Duration(milliseconds: index * 50),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))]),
                      child: Row(
                        children: [
                          CircleAvatar(radius: 20, backgroundImage: AssetImage(student['avatar'])),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(student['name'], style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                                Text(student['id'], style: TextStyle(fontSize: 11, color: AppColors.darkBlue.withOpacity(0.5))),
                              ],
                            ),
                          ),
                          Switch(
                            value: student['isPresent'],
                            onChanged: (val) => setState(() => student['isPresent'] = val),
                            activeColor: AppColors.skyBlue,
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(32))),
        child: ElevatedButton(
          onPressed: () => Navigator.pop(context),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.skyBlue,
            foregroundColor: Colors.white,
            minimumSize: const Size(double.infinity, 56),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          child: const Text('Save Attendance', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }
}
