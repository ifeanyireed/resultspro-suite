import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';
import 'login_page.dart';

class SchoolSelectionPage extends StatefulWidget {
  final bool isOnboarding;
  final String? role;
  const SchoolSelectionPage({super.key, this.isOnboarding = false, this.role});

  @override
  State<SchoolSelectionPage> createState() => _SchoolSelectionPageState();
}

class _SchoolSelectionPageState extends State<SchoolSelectionPage> {
  final List<Map<String, String>> _schools = [
    {
      'name': 'Loral International Schools',
      'location': 'Igbesa, Ogun State',
      'type': 'Boarding & Day',
      'image': 'assets/images/photo01.jpeg'
    },
    {
      'name': 'Loral International Schools',
      'location': 'Ikeja, Lagos',
      'type': 'Nursery & Primary',
      'image': 'assets/images/photo02.jpeg'
    },
    {
      'name': 'Loral International Schools',
      'location': 'Festac Town, Lagos',
      'type': 'Secondary School',
      'image': 'assets/images/photo03.jpeg'
    },
    {
      'name': 'Loral International Schools',
      'location': 'Day Secondary, Igbesa',
      'type': 'Day Secondary',
      'image': 'assets/images/photo04.jpeg'
    },
  ];

  List<Map<String, String>> _filteredSchools = [];
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _filteredSchools = _schools;
    _searchController.addListener(_onSearchChanged);
  }

  void _onSearchChanged() {
    setState(() {
      _filteredSchools = _schools
          .where((school) =>
              school['name']!.toLowerCase().contains(_searchController.text.toLowerCase()) ||
              school['location']!.toLowerCase().contains(_searchController.text.toLowerCase()))
          .toList();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final Color textColor = widget.isOnboarding ? Colors.white : AppColors.darkBlue;

    return Scaffold(
      backgroundColor: widget.isOnboarding ? Colors.transparent : const Color(0xFFEBF1FA),
      body: CustomScrollView(
        slivers: [
          // Header / Search Bar Area
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(24, widget.isOnboarding ? 80 : 64, 24, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      ScrollReveal(
                        child: Text(
                          'Select School',
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            color: textColor,
                            letterSpacing: -1,
                          ),
                        ),
                      ),
                      ScrollReveal(
                        delay: const Duration(milliseconds: 100),
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: widget.isOnboarding ? Colors.white.withOpacity(0.2) : Colors.white,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.notifications_outlined,
                            color: widget.isOnboarding ? Colors.white : AppColors.darkBlue.withOpacity(0.5),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  
                  // Refined Search Bar matching image
                  ScrollReveal(
                    delay: const Duration(milliseconds: 200),
                    child: Container(
                      height: 56,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(32),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.03),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: TextField(
                        controller: _searchController,
                        decoration: const InputDecoration(
                          hintText: 'Search for your school...',
                          hintStyle: TextStyle(color: Color(0xFFA0AEC0), fontSize: 15),
                          prefixIcon: Icon(Icons.search, color: Color(0xFFA0AEC0)),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(vertical: 18),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Main Content
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final school = _filteredSchools[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 20),
                    child: ScrollReveal(
                      delay: Duration(milliseconds: 300 + (index * 100)),
                      offset: const Offset(0, 20),
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(32), // High rounding like image
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.02),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => LoginPage(role: widget.role),
                                ),
                              );
                            },
                            borderRadius: BorderRadius.circular(32),
                            child: Padding(
                              padding: const EdgeInsets.all(20),
                              child: Row(
                                children: [
                                  // School Thumbnail
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(20),
                                    child: Image.asset(
                                      school['image']!,
                                      width: 80,
                                      height: 80,
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                  const SizedBox(width: 20),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          school['name']!,
                                          style: const TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.w800,
                                            color: AppColors.darkBlue,
                                          ),
                                        ),
                                        const SizedBox(height: 6),
                                        Row(
                                          children: [
                                            const Icon(Icons.location_on_outlined, size: 14, color: AppColors.skyBlue),
                                            const SizedBox(width: 4),
                                            Text(
                                              school['location']!,
                                              style: TextStyle(
                                                fontSize: 14,
                                                color: AppColors.darkBlue.withOpacity(0.6),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 10),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                          decoration: BoxDecoration(
                                            color: AppColors.skyBlue.withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(20),
                                          ),
                                          child: Text(
                                            school['type']!.toUpperCase(),
                                            style: const TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.w800,
                                              color: AppColors.skyBlue,
                                              letterSpacing: 1,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const Icon(
                                    Icons.chevron_right,
                                    color: Color(0xFFCBD5E0),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  );
                },
                childCount: _filteredSchools.length,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
