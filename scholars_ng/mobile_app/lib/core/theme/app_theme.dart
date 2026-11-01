import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.skyBlue,
        primary: AppColors.skyBlue,
        onPrimary: Colors.white,
        secondary: AppColors.skyBlue,
        onSecondary: Colors.white,
        surface: Colors.white,
        onSurface: AppColors.textOnWhite,
      ),
      textTheme: GoogleFonts.interTextTheme().copyWith(
        displayLarge: GoogleFonts.inter(
          fontSize: 56,
          fontWeight: FontWeight.w600,
          color: Colors.white,
          letterSpacing: -0.04,
        ),
        displayMedium: GoogleFonts.inter(
          fontSize: 40,
          fontWeight: FontWeight.w600,
          color: Colors.white,
          letterSpacing: -0.04,
        ),
        displaySmall: GoogleFonts.inter(
          fontSize: 28,
          fontWeight: FontWeight.w600,
          color: Colors.white,
          letterSpacing: -0.04,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 18,
          color: Colors.white,
          height: 1.7,
        ),
        labelLarge: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: Colors.white,
          letterSpacing: 0.2,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: AppColors.skyBlue,
          padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 20),
          textStyle: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.15,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
    );
  }
}
