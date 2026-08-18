import 'dart:ui';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';
import '../../../home/presentation/pages/dashboard_page.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  bool _obscurePassword = true;
  bool _agreeToTerms = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Background with Blur
          Positioned.fill(
            child: Image.asset(
              'assets/images/skies.jpeg',
              fit: BoxFit.cover,
            ),
          ),
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.white.withOpacity(0.3),
                      AppColors.darkBlue.withOpacity(0.15),
                    ],
                  ),
                ),
              ),
            ),
          ),

          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 40),
                  // Back Button
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                  const ScrollReveal(
                    child: Text(
                      'Create Account',
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: -1,
                        shadows: [
                          Shadow(
                            color: Colors.black26,
                            blurRadius: 10,
                            offset: Offset(0, 4),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  ScrollReveal(
                    delay: const Duration(milliseconds: 200),
                    child: Text(
                      'Join the SchoolHub community today.',
                      style: TextStyle(
                        fontSize: 16,
                        color: AppColors.darkBlue.withOpacity(0.7),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 48),
                  
                  _buildTextField(hint: 'Full Name', icon: Icons.person_outline),
                  const SizedBox(height: 20),
                  _buildTextField(hint: 'Email Address', icon: Icons.email_outlined, keyboardType: TextInputType.emailAddress),
                  const SizedBox(height: 20),
                  _buildTextField(hint: 'Phone Number', icon: Icons.phone_android_outlined, keyboardType: TextInputType.phone),
                  const SizedBox(height: 20),
                  _buildTextField(
                    hint: 'Password',
                    icon: Icons.lock_outline,
                    isPassword: true,
                    obscureText: _obscurePassword,
                    onTogglePassword: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Terms and Conditions
                  ScrollReveal(
                    delay: const Duration(milliseconds: 600),
                    child: Row(
                      children: [
                        SizedBox(
                          width: 24,
                          height: 24,
                          child: Checkbox(
                            value: _agreeToTerms,
                            onChanged: (val) => setState(() => _agreeToTerms = val ?? false),
                            activeColor: AppColors.skyBlue,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'I agree to the Terms of Service and Privacy Policy',
                            style: TextStyle(
                              fontSize: 13,
                              color: AppColors.darkBlue.withOpacity(0.7),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  // Sign Up Button
                  ScrollReveal(
                    delay: const Duration(milliseconds: 700),
                    child: SizedBox(
                      width: double.infinity,
                      height: 64,
                      child: ElevatedButton(
                        onPressed: _agreeToTerms ? () {
                          Navigator.pushAndRemoveUntil(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const DashboardPage(),
                            ),
                            (route) => false,
                          );
                        } : null,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.skyBlue,
                          foregroundColor: Colors.white,
                          elevation: _agreeToTerms ? 12 : 0,
                          shadowColor: AppColors.skyBlue.withOpacity(0.5),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                        ),
                        child: const Text(
                          'SIGN UP',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: 1.5),
                        ),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Login Link
                  Center(
                    child: ScrollReveal(
                      delay: const Duration(milliseconds: 800),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Already have an account? ',
                            style: TextStyle(color: AppColors.darkBlue.withOpacity(0.6)),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text(
                              'Login',
                              style: TextStyle(color: AppColors.skyBlue, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required String hint,
    required IconData icon,
    bool isPassword = false,
    bool obscureText = false,
    VoidCallback? onTogglePassword,
    TextInputType? keyboardType,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.8),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: TextField(
        obscureText: obscureText,
        keyboardType: keyboardType,
        style: const TextStyle(color: AppColors.darkBlue, fontWeight: FontWeight.bold),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: TextStyle(color: AppColors.darkBlue.withOpacity(0.4), fontWeight: FontWeight.normal),
          prefixIcon: Icon(icon, color: AppColors.skyBlue, size: 22),
          suffixIcon: isPassword
              ? IconButton(
                  icon: Icon(
                    obscureText ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                    color: AppColors.darkBlue.withOpacity(0.4),
                    size: 20,
                  ),
                  onPressed: onTogglePassword,
                )
              : null,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        ),
      ),
    );
  }
}
