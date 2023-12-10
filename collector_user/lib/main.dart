import 'package:flutter/material.dart';
import 'package:collector_user/components/top_nav_bar.dart';
import 'package:collector_user/contents/home.dart';
import 'package:collector_user/contents/notif.dart';
import 'package:collector_user/contents/garbagebin.dart';
import 'package:collector_user/contents/user.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(fontFamily: 'Poppins'),
      title: 'GABO',
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    HomeScreen(),
    NotificationsScreen(),
    GarbageBinScreen(),
    UserAccountScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: TopNavBar(),
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: [
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
