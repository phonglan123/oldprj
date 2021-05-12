/*

- Hỗ trợ ký hiệu toán học trong trình soạn thảo
- GG Login (đăng nhập trên nhiều thiết bị)
- Thông tin người dùng
- Bảng xếp hạng
- Đăng nhập 7 - 14 - 30 ngày liên tiếp
- Thành tích (badge)
- Làm việc nhóm (đóng góp, nhận xét)
- Chia sẻ dữ liệu Private - Public sử dụng bảo mật (RSA hoặc cái gì đó) ^^
- Chế độ ôn tập dàn trải:
	+ Học lần 1: 1 phút - 10 phút - 1 ngày
	+ Học lần 2: 1 ngày - 4 ngày - 7 ngày
- Forum chung
- Thông báo học tập
- Hỗ trợ điện thoại
- Đặt hình nền ngay trong phần cài đặt

*/

function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	console.log('ID: ' + profile.getId());
	console.log('Name: ' + profile.getName());
	console.log('Image URL: ' + profile.getImageUrl());

	var config = {
		apiKey: "AIzaSyA8C_7NWajMyrUrRFPUlYqNLeyUA_Kml_s",
		authDomain: "himakey-login.firebaseapp.com",
		databaseURL: "https://himakey-login.firebaseio.com",
		projectId: "himakey-login",
		storageBucket: "himakey-login.appspot.com",
		messagingSenderId: "250674481759",
		appId: "1:250674481759:web:e964533b495edbb95b69ea",
		measurementId: "G-S8S56TE7ZT"
	};

	firebase.initializeApp(config);
	var database = firebase.database();

	firebase.database()
		.ref('users/' + profile.getId())
		.set({
			username: profile.getName(),
			profile_picture: profile.getImageUrl(),
			data: database
		});

	var starCountRef = firebase.database()
		.ref('users/' + profile.getId());
	starCountRef.on('value', function(snapshot) {
		console.log(snapshot);
	});
}
