import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../../../../core/theme/app_colors.dart';

class TransportTrackingPage extends StatefulWidget {
  final bool isTab;
  const TransportTrackingPage({super.key, this.isTab = false});

  @override
  State<TransportTrackingPage> createState() => _TransportTrackingPageState();
}

class _TransportTrackingPageState extends State<TransportTrackingPage> {
  final MapController _mapController = MapController();
  
  // Mock locations
  final LatLng _busLocation = const LatLng(40.7128, -74.0060);
  final LatLng _schoolLocation = const LatLng(40.7300, -73.9950);

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
        title: const Text('Transport Tracking', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: Column(
        children: [
          // Map
          Expanded(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(32),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10))
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(32),
                child: FlutterMap(
                  mapController: _mapController,
                  options: MapOptions(
                    initialCenter: _busLocation,
                    initialZoom: 14.0,
                  ),
                  children: [
                    TileLayer(
                      urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      userAgentPackageName: 'com.schoolhub.app',
                    ),
                    PolylineLayer(
                      polylines: [
                        Polyline(
                          points: [
                            _busLocation,
                            const LatLng(40.7200, -74.0000),
                            _schoolLocation,
                          ],
                          color: AppColors.skyBlue,
                          strokeWidth: 5,
                        ),
                      ],
                    ),
                    MarkerLayer(
                      markers: [
                        Marker(
                          point: _busLocation,
                          width: 80,
                          height: 80,
                          child: const Icon(Icons.directions_bus, color: AppColors.skyBlue, size: 40),
                        ),
                        Marker(
                          point: _schoolLocation,
                          width: 80,
                          height: 80,
                          child: const Icon(Icons.school, color: Colors.green, size: 40),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
          
          // Details Bottom Sheet Style
          Container(
            padding: const EdgeInsets.all(32),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(40)),
              boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, -5))],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
                          child: const Text('ON TIME', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: 1)),
                        ),
                        const SizedBox(height: 12),
                        const Text('Bus #42 - Morning Route', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text('ETA', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                        const SizedBox(height: 4),
                        const Text('08:15 AM', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.skyBlue)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 32),
                Row(
                  children: [
                    const CircleAvatar(radius: 28, backgroundImage: AssetImage('assets/images/photo09.jpeg')),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Michael Driver', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                          const SizedBox(height: 4),
                          Text('Driver • +1 234 567 8900', style: TextStyle(fontSize: 13, color: AppColors.darkBlue.withOpacity(0.5))),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: AppColors.skyBlue.withOpacity(0.1), shape: BoxShape.circle),
                      child: const Icon(Icons.call_outlined, color: AppColors.skyBlue, size: 24),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
