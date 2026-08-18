import 'dart:async';
import 'package:flutter/material.dart';
import 'package:school_hub_flutter/core/theme/app_colors.dart';
import 'package:school_hub_flutter/core/widgets/scroll_reveal.dart';
import 'package:school_hub_flutter/features/onboarding/presentation/pages/onboarding_page.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> with SingleTickerProviderStateMixin {
  late final PageController _pageController;
  late final Timer _timer;
  
  // Use a very large number for infinite-like scrolling
  static const int _virtualItemCount = 10000;
  late int _currentPage;

  final List<String> _photos = [
    'assets/images/photo01.jpeg',
    'assets/images/photo02.jpeg',
    'assets/images/photo03.jpeg',
    'assets/images/photo04.jpeg',
    'assets/images/photo05.jpeg',
    'assets/images/photo06.jpeg',
    'assets/images/photo07.jpeg',
    'assets/images/photo08.jpeg',
    'assets/images/photo09.jpeg',
    'assets/images/photo10.jpeg',
    'assets/images/photo11.jpeg',
    'assets/images/photo12.jpeg',
    'assets/images/photo13.jpeg',
  ];

  @override
  void initState() {
    super.initState();
    
    // Start in the middle of our large range to allow scrolling both ways
    _currentPage = _virtualItemCount ~/ 2;
    // Align to the first photo
    _currentPage = _currentPage - (_currentPage % _photos.length);
    
    _pageController = PageController(
      viewportFraction: 0.8,
      initialPage: _currentPage,
    );
    
    // Auto-scroll timer
    _timer = Timer.periodic(const Duration(seconds: 3), (Timer timer) {
      _currentPage++;

      if (_pageController.hasClients) {
        _pageController.animateToPage(
          _currentPage,
          duration: const Duration(milliseconds: 1000),
          curve: Curves.easeInOutQuart,
        );
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background Image
          Positioned.fill(
            child: Image.asset(
              'assets/images/skies.jpeg',
              fit: BoxFit.cover,
            ),
          ),

          // Content
          SafeArea(
            child: CustomScrollView(
              physics: const BouncingScrollPhysics(),
              slivers: [
                SliverFillRemaining(
                  hasScrollBody: false,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 40),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Spacer(),
                        // Logo - Standalone and Larger
                        ScrollReveal(
                      child: SizedBox(
                        width: 150,
                        height: 150,
                        child: Image.asset('assets/images/logo.png'),
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // School Name - Rebranded
                    const ScrollReveal(
                      delay: Duration(milliseconds: 200),
                      child: Text(
                        'SchoolHub',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 72, 
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: -4,
                          height: 0.9,
                        ),
                      ),
                    ),
                    
                    const ScrollReveal(
                      delay: Duration(milliseconds: 400),
                      child: Text(
                        'BY RESULTSPRO',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: Colors.white70,
                          letterSpacing: 4,
                        ),
                      ),
                    ),

                    const SizedBox(height: 60),

                    // Auto-Scrolling Photo Gallery (Infinite Loop)
                    ScrollReveal(
                      delay: const Duration(milliseconds: 600),
                      child: SizedBox(
                        height: 220, 
                        child: PageView.builder(
                          controller: _pageController,
                          itemCount: _virtualItemCount,
                          onPageChanged: (index) {
                            _currentPage = index;
                          },
                          itemBuilder: (context, index) {
                            final photoIndex = index % _photos.length;
                            return AnimatedBuilder(
                              animation: _pageController,
                              builder: (context, child) {
                                double value = 1.0;
                                if (_pageController.position.haveDimensions) {
                                  value = _pageController.page! - index;
                                  value = (1 - (value.abs() * 0.25)).clamp(0.0, 1.0);
                                }
                                return Center(
                                  child: SizedBox(
                                    height: Curves.easeOut.transform(value) * 220,
                                    width: Curves.easeOut.transform(value) * 400,
                                    child: child,
                                  ),
                                );
                              },
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 12),
                                child: Container(
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(28),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.2),
                                        blurRadius: 25,
                                        offset: const Offset(0, 12),
                                      ),
                                    ],
                                  ),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(28),
                                    child: Image.asset(
                                      _photos[photoIndex],
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ),

                    const SizedBox(height: 60),

                    // Tagline
                    const ScrollReveal(
                      delay: Duration(milliseconds: 1000),
                      child: Text(
                        'MOULDING FUTURE LEADERS',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: AppColors.skyBlue,
                          letterSpacing: 2.5,
                        ),
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Get Started Button
                    ScrollReveal(
                      delay: const Duration(milliseconds: 1200),
                      offset: const Offset(0, 40),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 40),
                        child: SizedBox(
                          width: double.infinity,
                          height: 60,
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => const OnboardingPage(),
                                ),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.skyBlue,
                              foregroundColor: Colors.white,
                              elevation: 8,
                              shadowColor: AppColors.skyBlue.withOpacity(0.4),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                            child: const Text(
                              'GET STARTED',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 2,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    
                    const Spacer(),
                  ],
                ),
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
