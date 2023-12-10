import 'package:flutter/material.dart';
import 'package:collector_user/contents/garbagebin.dart';
import 'package:collector_user/contents/home.dart';
import 'package:collector_user/contents/notif.dart';
import 'package:collector_user/contents/user.dart';

class BottomNavBar extends StatefulWidget {
  const BottomNavBar({Key? key}) : super(key: key);

  @override
  _BottomNavBarState createState() => _BottomNavBarState();
}

class _BottomNavBarState extends State<BottomNavBar> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    HomeScreen(key: UniqueKey()),
    NotificationsScreen(key: UniqueKey()),
    GarbageBinScreen(key: UniqueKey()),
    UserAccountScreen(key: UniqueKey()),
  ];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        children: _pages,
        onPageChanged: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications),
            label: 'Notifications',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.delete),
            label: 'Garbage Bin',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_circle),
            label: 'User Account',
          ),
        ],
        selectedItemColor: Colors.blue, // Set the color of the selected icon
        unselectedItemColor:
            Colors.grey, // Set the color of the unselected icons
      ),
    );
  }
}
