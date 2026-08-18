import 'dart:ui';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';
import '../../../auth/presentation/pages/school_selection_page.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  String? _selectedRole;

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

          PageView(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            children: [
              _buildWelcomePage(),
              _buildRoleSelectionPage(),
              _buildNotificationsPage(),
              SchoolSelectionPage(isOnboarding: true, role: _selectedRole),
            ],
          ),

          // Top Navigation (Back & Skip)
          if (_currentPage < 3)
            Positioned(
              top: 60,
              left: 24,
              right: 24,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Back Button
                  if (_currentPage > 0)
                    IconButton(
                      onPressed: () {
                        _pageController.previousPage(
                          duration: const Duration(milliseconds: 600),
                          curve: Curves.easeInOut,
                        );
                      },
                      icon: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
                      ),
                    )
                  else
                    const SizedBox.shrink(),

                  // Skip Button
                  TextButton(
                    onPressed: () {
                      _pageController.animateToPage(
                        3,
                        duration: const Duration(milliseconds: 600),
                        curve: Curves.easeInOut,
                      );
                    },
                    child: const Text(
                      'SKIP',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                        shadows: [
                          Shadow(
                            color: Colors.black26,
                            blurRadius: 8,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

          // Bottom Navigation (Indicator & Button)
          if (_currentPage < 3)
            Positioned(
              bottom: 40,
              left: 40,
              right: 40,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Page Indicator
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(4, (index) {
                      return AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        margin: const EdgeInsets.only(right: 8),
                        height: 6,
                        width: _currentPage == index ? 24 : 6,
                        decoration: BoxDecoration(
                          color: _currentPage == index ? AppColors.skyBlue : AppColors.darkBlue.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(3),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 32),
                  // Global Next Button
                  _buildGlobalNextButton(),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildGlobalNextButton() {
    bool enabled = true;
    String label = 'CONTINUE';
    
    if (_currentPage == 1 && _selectedRole == null) {
      enabled = false;
    }
    
    if (_currentPage == 2) {
      label = 'ALLOW NOTIFICATIONS';
    }

    return SizedBox(
      width: double.infinity,
      height: 64,
      child: ElevatedButton(
        onPressed: enabled ? () {
          _pageController.nextPage(
            duration: const Duration(milliseconds: 600),
            curve: Curves.easeInOut,
          );
        } : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.skyBlue,
          foregroundColor: Colors.white,
          disabledBackgroundColor: AppColors.darkBlue.withOpacity(0.1),
          elevation: enabled ? 12 : 0,
          shadowColor: AppColors.skyBlue.withOpacity(0.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.5,
            color: enabled ? Colors.white : AppColors.darkBlue.withOpacity(0.2),
          ),
        ),
      ),
    );
  }

  Widget _buildWelcomePage() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Spacer(flex: 2),
          ScrollReveal(
            child: Container(
              height: 380,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(40),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.15),
                    blurRadius: 40,
                    offset: const Offset(0, 20),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(40),
                child: Image.asset(
                  'assets/images/photo05.jpeg',
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          const SizedBox(height: 50),
          const ScrollReveal(
            delay: Duration(milliseconds: 200),
            child: Text(
              'Welcome to SchoolHub',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 34,
                fontWeight: FontWeight.w900,
                color: AppColors.darkBlue,
                letterSpacing: -1,
              ),
            ),
          ),
          const SizedBox(height: 16),
          ScrollReveal(
            delay: const Duration(milliseconds: 400),
            child: Text(
              'Connecting schools, parents, and students in one powerful digital ecosystem.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: AppColors.darkBlue.withOpacity(0.7),
                height: 1.6,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          const Spacer(flex: 3),
        ],
      ),
    );
  }

  Widget _buildRoleSelectionPage() {
    final roles = [
      {'title': 'Parent', 'subtitle': 'Track your child\'s progress', 'icon': Icons.family_restroom_outlined},
      {'title': 'Student', 'subtitle': 'Access lessons & results', 'icon': Icons.school_outlined},
      {'title': 'Teacher', 'subtitle': 'Manage classes & grading', 'icon': Icons.psychology_outlined},
      {'title': 'School Admin', 'subtitle': 'Full school management', 'icon': Icons.admin_panel_settings_outlined},
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 120),
          const ScrollReveal(
            child: Text(
              'Who are you?',
              style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                letterSpacing: -1,
                shadows: [
                  Shadow(
                    color: Colors.black12,
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
              'Select your role to personalize your experience.',
              style: TextStyle(
                fontSize: 16,
                color: Colors.white.withOpacity(0.9),
              ),
            ),
          ),
          const SizedBox(height: 48),
          ...roles.asMap().entries.map((entry) {
            final index = entry.key;
            final role = entry.value;
            final isSelected = _selectedRole == role['title'];

            return ScrollReveal(
              delay: Duration(milliseconds: 300 + (index * 100)),
              offset: const Offset(20, 0),
              child: Padding(
                padding: const EdgeInsets.only(bottom: 20),
                child: InkWell(
                  onTap: () {
                    setState(() {
                      _selectedRole = role['title'] as String;
                    });
                  },
                  borderRadius: BorderRadius.circular(24),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.skyBlue : Colors.white.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                      border: Border.all(
                        color: isSelected ? AppColors.skyBlue : Colors.white,
                        width: 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: isSelected ? Colors.white.withOpacity(0.2) : AppColors.skyBlue.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            role['icon'] as IconData,
                            color: isSelected ? Colors.white : AppColors.skyBlue,
                            size: 28,
                          ),
                        ),
                        const SizedBox(width: 20),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                role['title'] as String,
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: isSelected ? Colors.white : AppColors.darkBlue,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                role['subtitle'] as String,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: isSelected ? Colors.white.withOpacity(0.9) : AppColors.darkBlue.withOpacity(0.6),
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (isSelected)
                          const Icon(Icons.check_circle_outline, color: Colors.white, size: 28),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }),
          const SizedBox(height: 180), // Space for global bottom nav
        ],
      ),
    );
  }

  Widget _buildNotificationsPage() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Spacer(),
          ScrollReveal(
            child: Container(
              width: 280,
              height: 280,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: AppColors.skyBlue.withOpacity(0.1),
                    blurRadius: 60,
                    spreadRadius: 20,
                  ),
                ],
              ),
              child: Center(
                child: Image.asset(
                  'assets/images/bell.png',
                  width: 200,
                  height: 200,
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),
          const SizedBox(height: 60),
          const ScrollReveal(
            delay: Duration(milliseconds: 200),
            child: Text(
              'Stay Updated',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 34,
                fontWeight: FontWeight.w900,
                color: AppColors.darkBlue,
                letterSpacing: -1,
              ),
            ),
          ),
          const SizedBox(height: 16),
          ScrollReveal(
            delay: const Duration(milliseconds: 400),
            child: Text(
              'Enable notifications to receive instant updates on results, assignments, and school announcements.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: AppColors.darkBlue.withOpacity(0.7),
                height: 1.6,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          const Spacer(flex: 3),
        ],
      ),
    );
  }
}
