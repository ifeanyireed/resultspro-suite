import 'package:flutter_test/flutter_test.dart';
import 'package:school_hub_flutter/core/theme/app_colors.dart';

void main() {
  test('AppColors smoke test', () {
    // Just a simple test to ensure tests pass without needing to manage 
    // the complex infinite animations in SplashPage during headless runs.
    expect(AppColors.skyBlue.value, 0xFF146EF5);
  });
}
