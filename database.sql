DROP DATABASE IF EXISTS `TDTuTube`;

CREATE DATABASE IF NOT EXISTS `TDTuTube`;

USE `TDTuTube`;

CREATE TABLE `role`
(
	`id` INT AUTO_INCREMENT,
	`name` VARCHAR(30) NOT NULL,
	`meta` VARCHAR(50) NOT NULL,
	`hide` BIT DEFAULT 0,
	`order` INT DEFAULT 0,
	`datebegin` DATE DEFAULT  NOW(),
	CONSTRAINT Role_PK PRIMARY KEY(`id`),
	CONSTRAINT Role_Meta_U UNIQUE(`meta`)
);

INSERT INTO `role` (`name`, `meta`) VALUES
	('admin', 'admin'),
	('user', 'user');


CREATE TABLE `user`
(
	`id` INT AUTO_INCREMENT,
	`name` VARCHAR(30) NOT NULL,
	`email` VARCHAR(254) NOT NULL,
	`password` VARCHAR(80) NOT NULL,
	`subscriber_count` INT DEFAULT 0,
	`avatar_path` VARCHAR(100) DEFAULT 'default.png',
	`role_id` INT NOT NULL,
	`meta` VARCHAR(50) NOT NULL,
	`hide` BIT DEFAULT 0,
	`order` INT DEFAULT 0,
	`datebegin` DATETIME DEFAULT NOW(),
	`status` BIT DEFAULT 0,
	CONSTRAINT User_PK PRIMARY KEY(`id`),
	CONSTRAINT User_Email_U UNIQUE(`email`),
	CONSTRAINT User_Meta_U UNIQUE(`meta`),
	CONSTRAINT User_Role_FK FOREIGN KEY(`role_id`) REFERENCES `role`(`id`)
);

-- Password = 123456
INSERT INTO `user` (`name`, `email`, `password`, `avatar_path`, `role_id`, `meta`, `status`) VALUES
	('Phước', 'admin@gmail.com', '$2b$10$F9zfPvuOpa74zm04KxAlv.bn2vPkJJn9JGB27k2z5Zz6ByW5alFB2', '1.png', 1, '@1', 0),
	('Ân', 'user1@gmail.com', '$2b$10$F9zfPvuOpa74zm04KxAlv.bn2vPkJJn9JGB27k2z5Zz6ByW5alFB2', '2.png', 2, '@2', 0),
	('Long', 'long@gmail.com', '$2b$10$F9zfPvuOpa74zm04KxAlv.bn2vPkJJn9JGB27k2z5Zz6ByW5alFB2', '3.png', 2, '@3', 0),
	('Hưng', 'user3@gmail.com', '$2b$10$F9zfPvuOpa74zm04KxAlv.bn2vPkJJn9JGB27k2z5Zz6ByW5alFB2', '4.png', 2, '@4', 0),
	('user5', 'user4@gmail.com', '$2b$10$F9zfPvuOpa74zm04KxAlv.bn2vPkJJn9JGB27k2z5Zz6ByW5alFB2', '5.png', 2, '@5', 0),
	('user6', 'user5@gmail.com', '$2b$10$F9zfPvuOpa74zm04KxAlv.bn2vPkJJn9JGB27k2z5Zz6ByW5alFB2', '6.png', 2, '@6', 0),
	('user7', 'user6@gmail.com', '$2b$10$F9zfPvuOpa74zm04KxAlv.bn2vPkJJn9JGB27k2z5Zz6ByW5alFB2', '7.png', 2, '@7', 0),
	('user8', 'user7@gmail.com', '$2b$10$F9zfPvuOpa74zm04KxAlv.bn2vPkJJn9JGB27k2z5Zz6ByW5alFB2', '8.png', 2, '@8', 0),
	('user9', 'user8@gmail.com', '$2b$10$F9zfPvuOpa74zm04KxAlv.bn2vPkJJn9JGB27k2z5Zz6ByW5alFB2', '9.png', 2, '@9', 0),
	('user10', 'user10@gmail.com', '$2b$10$F9zfPvuOpa74zm04KxAlv.bn2vPkJJn9JGB27k2z5Zz6ByW5alFB2', '10.png', 2, '@10', 0),
	('default', 'Test@gmail.com', '$2b$10$F9zfPvuOpa74zm04KxAlv.bn2vPkJJn9JGB27k2z5Zz6ByW5alFB2', 'default.PNG', 2, '@11', 0);

DROP TRIGGER IF EXISTS `TR_INSERT_USER`;
CREATE TRIGGER TR_INSERT_USER 
BEFORE INSERT ON `user` FOR EACH ROW
	SET NEW.meta = concat('@', (SELECT COUNT(*) + 1 FROM `user`));

CREATE TABLE `tag`
(
	`id` INT AUTO_INCREMENT,
	`name` VARCHAR(30) NOT NULL,
	`meta` VARCHAR(50) NOT NULL,
	`hide` BIT DEFAULT 0,
	`order` INT DEFAULT 0,
	CONSTRAINT Tag_Meta_U UNIQUE(`meta`),
	CONSTRAINT Tag_PK PRIMARY KEY(`id`)
);

INSERT INTO `tag` (`name`, `meta`) VALUES
	('Âm nhạc', 'am-nhac'),
	('Trò chơi', 'tro-choi'),
	('Tin tức', 'tin-tuc'),
	('Thể thao', 'the-thao'),
	('Hoạt hình', 'hoat-hinh'),
	('Toán học', 'toan-hoc'),
	('Thủ công', 'thu-cong'),
	('Du lịch', 'du-lich'),
	('Bóng đá', 'bong-da'),
	('Nấu ăn', 'nau-an'),
	('Thiên nhiên', 'thien-nhien'),
	('Hoạt họa', 'hoat-hoa'),
	('Vlog', 'vlog'),
	('Diễn thuyết', 'dien-thuyet'),
	('Hướng dẫn', 'huong-dan');

CREATE TABLE `video`
(
	`id` INT AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	`tag_id` INT NOT NULL,
	`title` VARCHAR(100) NOT NULL,
	`description` NVARCHAR(500) NOT NULL,
	`like_count` INT DEFAULT 0,
	`view_count` INT DEFAULT 0,
	`comment_count` INT DEFAULT 0,
	`privacy` BIT NOT NULL, -- Chế độ công khai, riêng tư,...
	`length` VARCHAR(10) NOT NULL, -- Độ dài video.
	`thumbnail` VARCHAR(200) NOT NULL, -- Đường dẫn tới thumbnail video.
	`path` VARCHAR(200) NOT NULL, -- Đường dẫn tới video.
	`feature` BIT NOT NULL DEFAULT 0, -- Chọn video có feature trên trang chính hay không (Phương án tạm).
	`meta` VARCHAR(50) NOT NULL,
	`hide` BIT DEFAULT 0,
	`order` INT DEFAULT 0,
	`datebegin` DATETIME DEFAULT NOW(),
	`status` BIT DEFAULT 1,
	CONSTRAINT Video_PK PRIMARY KEY(`id`),
	INDEX `Video_Index_id` USING BTREE (`id`),
	CONSTRAINT Video_Meta_U UNIQUE(`meta`),
	CONSTRAINT Video_User_FK FOREIGN KEY(`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT Video_Tag_FK FOREIGN KEY(`tag_id`) REFERENCES `tag`(`id`)
);

INSERT INTO `video` (`user_id`, `tag_id`, `title`, `description`, `datebegin`, `like_count`, `view_count`, `privacy`, `length`, `thumbnail`, `path`, `feature`, `status`, `meta`) VALUES
	(1, 3, 'Video 1', 'Video để test.', '2022-12-08 12:10:12', 0, 71, 0, '0:06', '1.PNG', '1.mp4', 1, 0, '1'),
	(3, 3, 'Video 2', 'Video hai để test.', '2022-12-07 23:10:12', 0, 51, 0, '0:11', '2.PNG', '2.mp4', 1, 0, '2'),
	(11, 1, 'Đây là video', 'Đây là mô tả', '2022-02-10 13:10:12', 0, 1235, 0, '0:06', '3.PNG', '3.mp4', 1, 0, '3'),
	(1, 2, 'Hello World', 'Chào', '2022-05-20 06:15:30', 0, 41045, 0, '0:06', '4.PNG', '4.mp4', 1, 0, '4'),
	(3, 4, 'Không phải video', 'Không có gì ở đây', '2021-12-09 18:42:52', 0, 14200022, 0, '0:06', '5.PNG', '5.mp4', 1, 0, '5'),
	(2, 5, '???', '?', '2020-07-12 08:09:10', 0, 1002110126, 0, '0:06', '6.PNG', '6.mp4', 1, 0, '6'),
	(8, 6, 'Bắt đầu với sản phẩm', 'Mô tả video.', '2022-12-12 20:14:32', 0, 51125, 0, '0:06', '7.PNG', '7.mp4', 1, 0, '7'),
	(2, 7, 'Đại học Tôn Đức Thắng', 'Tương tự như cách suy nghĩ của con người sẽ phản ứng lại khi tiếp nhận các tác nhân kích thích từ bên ngoài.', '2022-12-13 16:09:21', 0, 12, 1, '0:06', '8.PNG', '8.mp4', 0, 0, '8'),
	(5, 8, 'Tập giấy dán ghi nhớ', 'Tôi thích nghĩ lớn. Nếu đằng nào bạn cũng phải nghĩ, vậy thì hãy nghĩ lớn.', '2022-12-12 07:15:52', 0, 19, 0, '0:06', '9.PNG', '9.mp4', 1, 0, '9'),
	(7, 9, 'Mắt mèo', 'Chúng ta không có cơ hội làm quá nhiều điều nên hãy chắc chắn rằng mọi thứ chúng ta làm đều phải thật sự tuyệt vời. Bởi vì đây là cuộc đời của chúng ta.', '2022-12-16 15:15:52', 0, 9, 0, '0:06', '10.PNG', '10.mp4', 1, 0, '10'),
	(1, 4, 'Test Upload', 'Đây là video công khai', '2015-06-18 10:20:16', 0, 4102910, 0, '0:06', 'default.PNG', '11.mp4', 1, 0, '11'),
	(1, 14, 'aaaa', 'fasasdsa', '2022-12-18 16:27:52', 0, 14, 0, '0:28', 'default.PNG', '12.mp4', 1, 0, '12'),
	(1, 14, 'Uplaod', 'uplaod', '2022-11-18 20:01:05', 0, 1241, 0, '1:59', '4.PNG', '13.m4v', 1, 0, '13'),
	(1, 14, 'More video', 'Test Test', '2022-12-18 20:01:41', 0, 0, 1, '0:06', 'default.PNG', '14.mp4', 0, 0, '14'),
	(8, 14, 'Spam Video', 'spaming', '2022-12-18 20:02:35', 0, 0, 0, '0:06', 'default.PNG', '15.mp4', 0, 0, '15'),
	(8, 14, 'Những câu nói truyền cảm hứng từ những người thành công', 'Những người thành công không chỉ truyền cảm hứng về triết lý kinh doanh, phát triển sự nghiệp mà còn là những thông điệp tích cực về cuộc sống và giá trị nhân sinh.', '2022-12-18 20:03:34', 0, 0, 0, '0:14', 'default.PNG', '16.mp4', 1, 0, '16'),
	(2, 6, 'Nhà Xuất Bản Giáo Dục Việt Nam', 'Hãy gọi tên người sáng chế vĩ đại nhất', '2017-04-30 01:23:35', 0, 1512423, 0, '0:06', '6.PNG', '17.mp4', 1, 0, '17'),
	(2, 7, 'Tả cảnh hai bên bờ', 'Nêu cảm nghĩ của em về cảnh đó', '2016-04-06 03:00:53', 0, 1512423, 0, '0:06', '1.PNG', '18.mp4', 1, 0, '18'),
	(2, 8, 'văn miêu tả cảnh sông nước', 'Phe nào chuyền được 6 chuyền là thắng. Phe thua phải cõng phe thắng chạy dọc con sông suốt từ bến tắm đến tận gốc đa', '2022-10-13 01:48:05', 0, 1123141, 0, '0:06', '3.PNG', '19.mp4', 1, 0, '19'),
	(2, 9, 'đẹp bởi có con sông chảy qua làng', 'Quanh năm cần mẫn, dòng sông chở nặng phù sa bồi đắp cho ruộng lúa. Buổi sớm tinh mơ, dòng nước mờ mờ phẳng lặng chảy. Giữa trưa, mặt sông nhấp nhô ánh bạc lẫn màu xanh nước biếc. Chiều tà, dòng nước trở thành màu khói trong, hơi tối âm âm', '2022-12-13 13:48:45', 0, 414141123, 0, '0:06', '4.PNG', '20.mp4', 1, 0, '20'),
	(3, 10, 'Hai bên bờ sông, nhà cửa lô nhô', 'Dưới chân cầu, nơi con sông đổ ra biển là cầu Cá. Thuyền đi biển sơn hai màu xanh đỏ, đậu san sát gần một mỏm đá nối lên như hòn non bộ', '2017-04-30 01:23:35', 0, 1512423, 0, '0:06', '8.PNG', '21.mp4', 1, 0, '21'),
	(3, 11, 'Sáng sớm nhìn ra bờ sông', 'Nắng sớm mai lấp lóa như dát vàng mặt nước. Dòng sông vẫn cuồn cuộn chảy đỏ sậm phù sa, mang nặng nghĩa tình của con sông đối với người và đất miền Tây', '2022-11-04 07:47:07', 0, 1512423, 0, '0:06', '1.PNG', '22.mp4', 1, 0, '22'),
	(3, 12, 'Những buổi sáng đẹp trời', 'Những ngày nghỉ học, em được chị hai cho đi theo. Thuyền đi trong sương sớm, ngồi trên thuyền, các bà các chị không ngớt lời trò chuyện', '2022-11-05 07:47:07', 0, 1512423, 0, '0:06', '4.PNG', '23.mp4', 1, 0, '23'),
	(4, 13, 'Dòng sông vang lên tiếng người cười nói', 'Những tiếng hò, tiêng hát vang lên như gọi mặt trời thức dậy. Những ngày không đi chợ cùng chị, em lại cùng các bạn đi cào hến, dậm trai ở ven sông', '2022-11-25 11:30:38', 0, 25852, 0, '0:06', '1.PNG', '24.mp4', 1, 0, '24'),
	(4, 14, 'đoạn văn miêu tả cảnh sông nước', 'Mỗi sớm mai, mặt sông phẳng lặng như gương. Dòng sông giống hệt dải lụa mềm mại trải dài tít tắp', '2022-12-10 06:07:49', 0, 124224, 0, '0:06', 'default.PNG', '25.mp4', 1, 0, '25'),
	(4, 15, 'Nàng tiên Ốc', 'Tuổi cao, ốm yếu, sống một mình, hàng ngày mò cua bắt ốc sống qua ngày', '2022-11-25 06:33:09', 0, 3117, 0, '0:06', '4.PNG', '26.mp4', 1, 0, '26'),
	(5, 3, 'Dưới thời Hùng Vương', 'người Lạc Việt đã có những nét đặc trưng riêng về cuộc sống ăn, ở, sinh hoạt lễ hội. Thông qua các hiện vật của người xưa để lại', '2022-10-20 10:49:34', 0, 108693420, 0, '0:06', '9.PNG', '27.mp4', 1, 0, '27'),
	(5, 4, 'Sở thích của tôi là nghe nhạc', 'Tôi thích xem những bộ phim sitcom của Mỹ như How I met your mother, Once upon a time, Sabrina', '2022-08-25 01:35:48', 0, 6044, 0, '0:06', '2.PNG', '28.mp4', 1, 0, '28'),
	(5, 5, 'Sự bó buộc của xã hội phong kiến', 'sự tàn ác của những thế lực đen tối đã khiến cho cuộc đời của họ đầy những chông gai, sóng gió', '2022-08-05 06:34:59', 0, 12, 0, '0:06', '5.PNG', '29.mp4', 1, 0, '29'),
	(6, 6, 'HEllo', 'asdfsw', '2022-09-23 13:54:56', 0, 5467, 0, '0:06', '10.PNG', '30.mp4', 1, 0, '30'),
	(6, 7, 'More video', 'Bad tuber', '2022-03-05 05:07:08', 0, 12308, 0, '0:06', '1.PNG', '31.mp4', 1, 0, '31'),
	(6, 8, 'hello everyone', 'chungus', '2022-06-11 23:17:51', 0, 402952, 0, '0:06', '4.PNG', '32.mp4', 1, 0, '32'),
	(6, 9, 'what is this', 'new vid', '2022-06-16 14:04:42', 0, 758544, 0, '0:06', '5.PNG', '33.mp4', 1, 0, '33'),
	(7, 10, 'Tình mẫu thứ vô cùng đáng trân trọng', 'Chúng ta sinh ra sẽ thật may mắn và hạnh phúc nếu được sống trong sự yêu thương của những người thân', '2017-04-30 01:23:35', 0, 5939, 0, '0:06', '10.PNG', '34.mp4', 1, 0, '34'),
	(7, 11, 'Và trên hành trình trưởng thành từ những bước đi nhỏ bé đầu', 'Quả là, con dù lớn vẫn là con của mẹ – vẫn bé bỏng đối với mẹ và cần được che chở. Nhờ có tình mẫu tử mà con người có', '2011-04-30 01:23:35', 0, 1241, 0, '0:06', '9.PNG', '35.mp4', 1, 0, '35'),
	(7, 12, 'Đoạn Văn Tả Ngôi Trường', 'Ngôi trường của em đang học là ngôi trường nằm ở ngoại thành thành phố mang tên Bác, em yêu quý trường của em và em đến đây để học hằng ngày.', '2022-04-30 01:23:35', 0, 414123, 0, '0:06', '8.PNG', '36.mp4', 1, 0, '36'),
	(8, 13, 'Ba mẹ em nói là đi', 'học con phải ngoan và làm theo lời cô giáo dặn', '2022-12-10 04:32:58', 0, 1241211, 0, '0:06', '7.PNG', '37.mp4', 1, 0, '37'),
	(9, 14, 'Đại dịch COVID-19 đã và đang tiếp tục là một thách thức đặc biệt không chỉ với riêng Việt Nam', 'sự vào cuộc quyết liệt, không', '2022-05-16 13:11:21', 0, 1099052, 0, '0:06', '5.PNG', '38.mp4', 1, 0, '38'),
	(9, 15, 'Nhưng chính trong thời điểm này', 'Hằng ngày, em đến trường bằng chiếc xe đạp cũ của mẹ cho', '2022-01-15 08:32:16', 0, 54438, 0, '0:06', '4.PNG', '39.mp4', 1, 0, '39'),
	(9, 1, 'Yên xe được thay mới nên rất êm', 'Xe còn có giỏ phía trước để em đựng cặp khi đi học. Xích xe quay đều kêu rè rè nhưng xe đạp rất nhẹ', '2022-03-19 18:38:18', 0, 554526, 0, '0:06', '3.PNG', '40.mp4', 1, 0, '40'),
	(9, 2, 'Văn Tả Đồ Vật', 'Các bạn của em đều thích chiếc xe đạp này. Em rất tự hào đã tự mình đến trường bằng xe đạp, không phiền bố mẹ phải đưa đón', '2022-04-23 13:09:34', 0, 5529023, 0, '0:06', '2.PNG', '41.mp4', 1, 0, '41'),
	(10, 3, 'Ngôi trường của em đang học có nhiều bóng', 'Khi mùa thu về', '2022-07-03 16:30:34', 0, 796730, 0, '0:06', '2.PNG', '42.mp4', 1, 0, '42'),
	(10, 4, 'Phía xa ngoài cánh đồng', 'Không khí mùa thu khiến cho con người cảm thấy thật dễ chịu, nhẹ nhàng. Không dừng lại ở đó, mùa thu còn có những kí ức đẹp đẽ của tuổi thơ tôi', '2022-10-10 04:26:56', 0, 8145474, 0, '0:06', '3.PNG', '43.mp4', 1, 0, '43'),
	(10, 5, 'Đó là đêm trăng Trung thu', 'Tình mẫu thứ vô cùng đáng trân trọng', '2022-11-09 01:41:38', 0, 3990961, 0, '0:06', '4.PNG', '44.mp4', 1, 0, '44'),
	(10, 6, 'Chúng ta sinh ra sẽ thật may mắn và hạnh phúc nếu được sống trong sự yêu thương của những người thân', 'Và trên hành trình trưởng thành từ những bước đi nhỏ bé đầu tiên đến những', '2022-03-28 09:52:00', 0, 461, 0, '0:06', '5.PNG', '45.mp4', 1, 0, '45'),
	(11, 10, 'Khi chúng ta mắc sai lầm', 'Ngôi trường của em đang học là ngôi trường nằm ở ngoại thành thành phố mang tên Bác, em yêu quý trường của em và em đến đây để học hằng ngày', '2022-02-13 06:38:18', 0, 231, 0, '0:06', '6.PNG', '46.mp4', 1, 0, '46'),
	(11, 12, 'Ở sân trường được thầy cô', 'Ba mẹ em nói là đi học con phải ngoan', '2022-01-25 09:08:21', 0, 215, 0, '0:06', '4.PNG', '47.mp4', 1, 0 ,'47'),
	(11, 11, 'Đại dịch COVID-19 đã và đang tiếp tục', 'Đại dịch COVID-19 đã và đang đe dọa nghiêm trọng an toàn và sức khỏe', '2022-05-26 04:53:39', 0, 121, 0, '0:06', '2.PNG', '48.mp4', 1, 0, '48'),
	(4, 2, 'Xin con đừng đi', 'Cô gái biết ơn bà lão đã cứu mạng mình lại cảm thương số phận của bà nên đã đồng ý ở lại cùng bà', '2022-11-03 12:35:14', 0, 62670, 0, '0:06', '1.PNG', '49.mp4', 1, 0, '49'),
	(4, 2, 'Hội Của Người Lạc Việt Thời Hùng Vương', 'Viết Một Đoạn Văn Ngắn Nói Về Cuộc Sống Ăn Ở Sinh Hoạt Lễ Hội Của Người Lạc Việt Thời Hùng Vương, đón đọc mẫu văn sau để trau dồi thêm cho mình kiến thức hay.', '2022-12-11 01:20:30', 0, 101929, 0, '0:06', '5.PNG', '50.mp4', 1, 0, '50');

CREATE TABLE `like`
(
	`user_id` INT NOT NULL,
	`video_id` INT NOT NULL,
	`like_state` BIT DEFAULT 0,
	`meta` VARCHAR(50),
	`hide` BIT DEFAULT 0,
	`order` INT DEFAULT 0,
	`datebegin` DATE DEFAULT  NOW(),
	CONSTRAINT Like_PK PRIMARY KEY(`user_id`, `video_id`),
	CONSTRAINT Like_User_FK FOREIGN KEY(`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT Like_Video_FK FOREIGN KEY(`video_id`) REFERENCES `video`(`id`)
);

DROP TRIGGER IF EXISTS `TR_INSERTLIKE`;
CREATE TRIGGER TR_INSERTLIKE 
AFTER INSERT ON `like` FOR EACH ROW
	UPDATE video 
	SET like_count = (SELECT SUM(`like_state`) FROM `like` WHERE video_id = NEW.video_id)
	WHERE id = NEW.video_id;

DROP TRIGGER IF EXISTS `TR_UPDATELIKE`;
CREATE TRIGGER TR_UPDATELIKE 
AFTER UPDATE ON `like` FOR EACH ROW
	UPDATE video 
	SET like_count = (SELECT SUM(`like_state`) FROM `like` WHERE video_id = NEW.video_id)
	WHERE id = NEW.video_id;

DROP TRIGGER IF EXISTS `TR_DELETELIKE`;
CREATE TRIGGER TR_DELETELIKE 
AFTER DELETE ON `like` FOR EACH ROW
	UPDATE video 
	SET like_count = (SELECT SUM(`like_state`) FROM `like` WHERE video_id = OLD.video_id)
	WHERE id = OLD.video_id;

INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES ('1', '1', 1);
INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES ('2', '1', 0);
INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES ('3', '1', 1);

INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES	('1', '2', 1);
INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES ('3', '2', 0);
INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES ('6', '2', 0);
INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES ('7', '2', 1);

INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES	('1', '3', 1);
INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES	('2', '3', 1);
INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES	('4', '3', 0);
INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES	('5', '3', 1);
INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES	('6', '3', 0);
INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES	('7', '3', 1);

INSERT INTO `like` (`user_id`, `video_id`, `like_state`) VALUES	('1', '4', 1);

CREATE TABLE `comment`
(
	`id` INT AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	`video_id` INT NOT NULL,
	`content` VARCHAR(250) NOT NULL,
	`hide` BIT DEFAULT 0,
	`order` INT DEFAULT 0,
	`datebegin` DATETIME DEFAULT NOW(),
	CONSTRAINT Comment_PK PRIMARY KEY(`id`),
	CONSTRAINT Comment_User_FK FOREIGN KEY(`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT Comment_Video_FK FOREIGN KEY(`video_id`) REFERENCES `video`(`id`)
);

DROP TRIGGER IF EXISTS `TR_INSERTCOMMENT`;
CREATE TRIGGER TR_INSERTCOMMENT 
AFTER INSERT ON `comment` FOR EACH ROW
	UPDATE video 
	SET comment_count = (SELECT COUNT(`id`) FROM `comment` WHERE video_id = NEW.video_id)
	WHERE id = NEW.video_id;

DROP TRIGGER IF EXISTS `TR_DELETECOMMENT`;
CREATE TRIGGER TR_DELETECOMMENT 
AFTER DELETE ON `comment` FOR EACH ROW
	UPDATE video 
	SET comment_count = (SELECT COUNT(`id`) FROM `comment` WHERE video_id = OLD.video_id)
	WHERE id = OLD.video_id;

INSERT INTO `comment` (`user_id`, `video_id`, `content`, `datebegin`) VALUES
	('1', '1', 'Test Comment', '2023-03-16 22:25:00');
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `datebegin`) VALUES	
	('1', '1', 'More Test Comment', '2023-03-16 22:30:00');
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `datebegin`) VALUES	
	('2', '1', 'Xin chào', '2023-03-17 22:25:00');
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `datebegin`) VALUES
	('3', '1', 'Spam comment', '2023-03-16 22:25:00');
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `datebegin`) VALUES
	('3', '1', 'Spam comment', '2023-03-16 22:25:00');
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `datebegin`) VALUES
	('4', '1', 'Spam comment', '2023-03-16 22:25:00');
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `datebegin`) VALUES
	('5', '1', 'Spam comment', '2021-03-16 22:25:00');
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `datebegin`) VALUES
	('3', '1', 'Spam comment', '2023-03-16 22:25:00');
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `datebegin`) VALUES
	('4', '1', 'Spam comment', '2020-03-16 22:25:00');
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `datebegin`) VALUES
	('8', '1', 'Spam comment', '2020-03-16 22:25:00');
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `datebegin`) VALUES
	('6', '1', 'Spam comment', '2023-03-16 22:25:00');
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `datebegin`) VALUES
	('3', '1', 'Spam comment', '2023-03-16 22:25:00');

CREATE TABLE `subscribe`
(
	`user_id` INT NOT NULL,
	`subscribe_user_id` INT NOT NULL,
	`subscribe_state` BIT DEFAULT 0,
	`hide` BIT DEFAULT 0,
	`order` INT DEFAULT 0,
	`datebegin` DATE DEFAULT  NOW(),
	CONSTRAINT Subscribe_PK PRIMARY KEY(`user_id`, `subscribe_user_id`),
	CONSTRAINT Subscribe_User_FK FOREIGN KEY(`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT Subscribe_SubUser_FK FOREIGN KEY(`subscribe_user_id`) REFERENCES `user`(`id`)
);

DROP TRIGGER IF EXISTS `TR_INSERTSUBSCRIBE`;
CREATE TRIGGER TR_INSERTSUBSCRIBE 
AFTER INSERT ON `subscribe` FOR EACH ROW
	UPDATE user 
	SET subscriber_count = (SELECT SUM(`subscribe_state`) FROM `subscribe` WHERE subscribe_user_id = NEW.subscribe_user_id)
	WHERE id = NEW.subscribe_user_id;

DROP TRIGGER IF EXISTS `TR_UPDATESUBSCRIBE`;
CREATE TRIGGER TR_UPDATESUBSCRIBE 
AFTER UPDATE ON `subscribe` FOR EACH ROW
	UPDATE user 
	SET subscriber_count = (SELECT SUM(`subscribe_state`) FROM `subscribe` WHERE subscribe_user_id = NEW.subscribe_user_id)
	WHERE id = NEW.subscribe_user_id;

DROP TRIGGER IF EXISTS `TR_DELETESUBSCRIBE`;
CREATE TRIGGER TR_DELETESUBSCRIBE 
AFTER DELETE ON `subscribe` FOR EACH ROW
	UPDATE user 
	SET subscriber_count = (SELECT SUM(`subscribe_state`) FROM `subscribe` WHERE subscribe_user_id = OLD.subscribe_user_id)
	WHERE id = OLD.subscribe_user_id;

INSERT INTO `subscribe` (`user_id`, `subscribe_user_id`, `subscribe_state`) VALUES ('2', '1', 0);
INSERT INTO `subscribe` (`user_id`, `subscribe_user_id`, `subscribe_state`) VALUES ('4', '1', 1);
INSERT INTO `subscribe` (`user_id`, `subscribe_user_id`, `subscribe_state`) VALUES ('5', '1', 1);
INSERT INTO `subscribe` (`user_id`, `subscribe_user_id`, `subscribe_state`) VALUES ('7', '1', 0);
INSERT INTO `subscribe` (`user_id`, `subscribe_user_id`, `subscribe_state`) VALUES ('6', '1', 1);

INSERT INTO `subscribe` (`user_id`, `subscribe_user_id`, `subscribe_state`) VALUES ('1', '2', 1);

INSERT INTO `subscribe` (`user_id`, `subscribe_user_id`, `subscribe_state`) VALUES ('1', '3', 1);
INSERT INTO `subscribe` (`user_id`, `subscribe_user_id`, `subscribe_state`) VALUES ('2', '3', 1);

INSERT INTO `subscribe` (`user_id`, `subscribe_user_id`, `subscribe_state`) VALUES ('1', '4', 1);

INSERT INTO `subscribe` (`user_id`, `subscribe_user_id`, `subscribe_state`) VALUES ('1', '5', 1);

CREATE TABLE `playlist`
(
	`id` INT AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	`name` VARCHAR(100) NOT NULL,
	`video_count` INT DEFAULT 0,
	`privacy` BIT NOT NULL, -- Chế độ công khai, riêng tư,...
	`meta` VARCHAR(50),
	`hide` BIT DEFAULT 0,
	`order` INT DEFAULT 0,
	`dateedit` DATETIME DEFAULT NOW(),
	`datebegin` DATETIME DEFAULT NOW(),
	CONSTRAINT Playlist_PK PRIMARY KEY(`id`),
	INDEX `Playlist_Index_id` USING BTREE (`id`),
	CONSTRAINT Playlist_Meta_U UNIQUE(`meta`),
	CONSTRAINT Playlist_User_FK FOREIGN KEY(`user_id`) REFERENCES `user`(`id`)
);

INSERT INTO `playlist` (`user_id`, `name`, `privacy`, `datebegin`) VALUES
	(1, 'Test Playlist', 0, '2023-03-21 18:51:00'),
	(1, 'Test Playlist 2', 0, '2023-03-21 18:52:00'),
	(1, 'Test Playlist 3', 1, '2023-03-21 18:52:00');

CREATE TABLE `playlistcontent`
(
	`id` INT AUTO_INCREMENT,
	`playlist_id` INT NOT NULL,
	`video_id` INT NOT NULL,
	`meta` VARCHAR(50),
	`hide` BIT DEFAULT 0,
	`order` INT DEFAULT 0,
	`datebegin` DATETIME DEFAULT NOW(),
	CONSTRAINT PlaylistContent_PK PRIMARY KEY(`id`),
	CONSTRAINT PlaylistContent_Playlist_FK FOREIGN KEY(`playlist_id`) REFERENCES `playlist`(`id`),
	INDEX `PlaylistContent_Index_playlist_id` USING BTREE (`playlist_id`),
	CONSTRAINT PlaylistContent_Video_FK FOREIGN KEY(`video_id`) REFERENCES `video`(`id`)
);

DROP TRIGGER IF EXISTS `TR_INSERT_VIDEO_PLAYLIST`;
CREATE TRIGGER TR_INSERT_VIDEO_PLAYLIST 
AFTER INSERT ON `playlistcontent` FOR EACH ROW
	UPDATE playlist 
	SET dateedit = NOW(),
		video_count = (SELECT COUNT(`id`) FROM `playlistcontent` WHERE playlist_id = NEW.playlist_id)
	WHERE id = NEW.playlist_id;

DROP TRIGGER IF EXISTS `TR_DELETE_VIDEO_PLAYLIST`;
CREATE TRIGGER TR_DELETE_VIDEO_PLAYLIST 
AFTER DELETE ON `playlistcontent` FOR EACH ROW
	UPDATE playlist
	SET dateedit = NOW(),
		video_count = (SELECT COUNT(`id`) FROM `playlistcontent` WHERE playlist_id = OLD.playlist_id)
	WHERE id = OLD.playlist_id;

INSERT INTO `playlistcontent` (`playlist_id`, `video_id`) VALUES (1, 1);

INSERT INTO `playlistcontent` (`playlist_id`, `video_id`) VALUES (1, 2);

CREATE TABLE `history`
(
	`id` INT AUTO_INCREMENT,
	`user_id` INT,
	`video_id` INT,
	`datebegin` DATETIME DEFAULT NOW(),
	CONSTRAINT History_PK PRIMARY KEY(`id`),
	CONSTRAINT History_User_FK FOREIGN KEY(`user_id`) REFERENCES `User`(`id`),
	CONSTRAINT History_Video_FK FOREIGN KEY(`video_id`) REFERENCES `video`(`id`)
)