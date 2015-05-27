-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 25, 2015 at 12:34 AM
-- Server version: 5.5.40
-- PHP Version: 5.4.36-0+deb7u3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `MySQLtest`
--

-- --------------------------------------------------------

--
-- Table structure for table `HISTORY`
--

CREATE TABLE IF NOT EXISTS `HISTORY` (
  `ID_USER` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID_RECIPE` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID_USER`,`ID_RECIPE`),
  UNIQUE KEY `ID_RECIPE` (`ID_RECIPE`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `INGREDIENT`
--

CREATE TABLE IF NOT EXISTS `INGREDIENT` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=82 ;

--
-- Dumping data for table `INGREDIENT`
--

INSERT INTO `INGREDIENT` (`ID`, `NAME`) VALUES
(1, 'oua'),
(2, 'zahar'),
(3, 'lapte'),
(4, 'unt'),
(5, 'ulei'),
(6, 'faina'),
(7, 'rosii'),
(8, 'castraveti'),
(9, 'ardei gras'),
(10, 'branza de vaca'),
(11, 'branza de oaie'),
(12, 'smantana'),
(13, 'carne de pui'),
(14, 'carne de vita'),
(15, 'carne de peste'),
(16, 'malai'),
(17, 'ciuperci'),
(18, 'spanac'),
(19, 'cartofi'),
(20, 'morcovi'),
(21, 'porumb'),
(22, 'ghimbir'),
(23, 'cascaval'),
(24, 'kaiser'),
(25, 'varza'),
(26, 'masline'),
(27, 'rosmarin'),
(29, 'rosii cherry'),
(30, 'salata verde'),
(31, 'sare'),
(32, 'piper'),
(33, 'ulei de masline'),
(34, 'ardei iute'),
(35, 'ceapa alba'),
(36, 'usturoi'),
(37, 'dovlecel'),
(38, 'marar'),
(39, 'psyllium'),
(40, 'quinoa'),
(41, 'cimbru'),
(42, 'tarhon'),
(43, 'besamel'),
(44, 'pesmet'),
(45, 'sunca'),
(47, 'boia dulce'),
(48, 'menta'),
(49, 'busuioc'),
(50, 'foaie dafin'),
(52, 'oregano'),
(53, 'bacon'),
(55, 'vin rosu'),
(56, 'chili'),
(57, 'miere'),
(58, 'sos soia'),
(59, 'sos worcester'),
(60, 'ghimbir'),
(61, 'bere'),
(62, 'orez'),
(64, 'patrunjel'),
(65, 'bulion'),
(80, 'salata verde'),
(81, 'carne de porc');

-- --------------------------------------------------------

--
-- Table structure for table `RECIPE`
--

CREATE TABLE IF NOT EXISTS `RECIPE` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `NAME` varchar(100) NOT NULL,
  `QUANTITY_INGREDIENTS` varchar(500) NOT NULL,
  `RECIPE_CONTENT` varchar(500) NOT NULL,
  `SERVING` varchar(500) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `RECIPE`
--

INSERT INTO `RECIPE` (`ID`, `NAME`, `QUANTITY_INGREDIENTS`, `RECIPE_CONTENT`, `SERVING`) VALUES
(1, 'Cordon Bleu', 'muschi de porc, kaiser, cascaval, ou, faina, menta, boia iute si dulce, busuioc, sare, piper', 'Muschiul l-am taiat tip buzunar si l-am batut bine. L-am sarat si piperat si umplut cu kaizer si cascaval. L-am prins cu scobitori si l-am dat prin faina. L-am lasat la rece.  Am facut un amestec din: ou, faina, menta, boia iute si dulce, busuioc. subtiat cu airan, am dat bucatile de muschi de porc prin el si am prajit in baie de ulei incins.', 'Cordon Bleu se serveste cu cartofi aurii si salata.'),
(2, 'Papricas de pui cu smantana', '800 de grame-1 kg de carne de pui, 200 de grame de smantana, cat de multa ceapa (ceapa va da onctuozitate sosului si dulceata mancarii), 2 linguri de ulei, sare, piper, o lingura de boia de ardei dulce de buna calitate, 2 linguri de faina, foaie de dafin, marar', 'Carnea se prajeste in ulei, pe toate partile, doar pana se coaguleaza sangele. Se scoate si se pastreaza intr-un loc cald. In grasimea ramasa se caleste ceapa tocata, adaugand si sarea, pana devine sticloasa. Se adauga boiaua de ardei, se amesteca, se pune imediat carnea in oala si se acopera cu apa fierbinte. Se adauga foaia de dafin si se lasa sa fiarba pana carnea e moale, verificand in permanenta sa aiba suficient lichid. Dupa ce carnea s-a fiert se lasa pe foc mic sa mai scada sosul, intre ', 'Papricasul de pui cu smantana se serveste cald, cu o garnitura potrivita unei mancari cu sos, presarand verdeata tocata.'),
(3, 'Cowboy Pie - placinta cu carne si porumb', '- 400g carne de vita tocata - o ceapa mare - 500 g de rosii tocate (eu am avut la cutie) - o lingura de faina pentru sos - doi catei de usturoi - 400 g de boabe de porumb fiert - 5-6 cartofi potriviti - lapte, vreo 200 ml, nu stiu nici eu exact cat a intrat la piure - 3-4 linguri de ulei  - optional boia dulce sau picanta sau branza rasa', 'Reteta aceasta este adaptata de nord-americani plecand de la traditionala shepherd''s pie (adica placinta oierului), care se face cu miel. Americanii o fac cu carnita de vita (ca asa sunt ei mai vacari) si cu porumb.  1. Se pun cartofii la fiert. 2. Se toaca ceapa, si se caleste in ulei pana se inmoaie. 3. Se adauga carnea tocata peste ceapa si se caleste pana isi schimba culoarea. 4. Se adauga rosiile tocate peste carne si o lingura de faina desfacuta in apa rece si se lasa la fiert la foc mic v', 'Placinta cu carne si porumb se lasa sa se raceasca 20 de minute, apoi se taie si se serveste.'),
(4, 'Snitel Cordon Bleu cu ciuperci', 'Piept de pui – 100 g pe portie, cascaval, sunca, ciuperci, faina de grau, besamel ( facut din ou, faina si lapte ), pesmet.', 'Snitelul Gordon Bleu este o mancare cu carne de pui delicioasa si usoara de preparat. Pieptul  de pui – 100 g pe portie, se bate bine, se condimenteaza, apoi se pun felii de cascaval, sunca si ciuperci. Se ruleaza bine, se introduc capetele inauntru, se da prin faina de grau, apoi in besamel ( facut din ou, faina si lapte ). Se da apoi prin pesmet, iar prin besamel, iar prin pesmet si se frige in ulei incins.', 'Snitel cordon bleu poate fi servit cu cartofi.'),
(5, 'Chiftelute la cuptor', 'Pulpe de pui - 1 kg ceapa alba - 3 bucati medii usturoi - 6 capatani dovlecel - o jumatate marar - 3 legaturi oua - 2 bucati ciuperci - 200 g. psyllium - 1 lingurita quinoa - 2 linguri sare - 1 varf de lingurita piper - 1 varf de lingurita cimbru - 1 lingurita tarhon - la alegere', 'Se taie carnea de pui marunt (dupa ce se inlatura pielita).  Dovlecelul si ciupercile se taie bucati mici si se amesteca apoi cu carnea, condimentele si ouale.  Se formeaza fiecare chiftelute si se trece prin quinoa. Se pun chiftelutele la copt, in tava tapetata cu hartie de copt', 'Chiftelutele la cuptor se servesc in sos marinat sau alaturi de briose cu legume.'),
(6, 'Antricot de vita pe gratar cu rosii coapte', 'antricot de vita 350 g, rosii cherry 100 g, salata verde 30 g, unt 20 g, rozmarin, sare, piper, ulei de masline, ardei iute 5 g', 'Antricotul de vita se cresteaza si se condimenteaza cu piper, apoi se sareaza si se pune pe gratar.  Rosiile cherry se pun pe gratar alaturi de carne. Se adauga ardeiul iute taiat felii.  Dupa ce s-a fript carnea pe gratar, se pune într-o tigaie si se presara rozmarin si putina sare. Peste carne se adauga untul taiat cubulete si toarna uleiul de masline, apoi se pune tigaia in cuptor putin, pana ce se topeste untul.', 'Antricotul de vita pe gratar se serveste cu salata verde, rosii cherry coapte pe gratar si ardei iute, alaturi de un vin rosu.'),
(7, 'Mancare italiana de pui', '250g rosii cherry taiate in doua, 8 catei usturoi in coaja, 1 crenguta mare frunze oregano proaspete sau 1 lingurita oregano uscat, 120 g panceta sau bacon, 2 bucati piept de pui sau 2 pulpe mari, 1 cana masline negre,1 pahar vin sec, piper negru, ulei de masline, cascaval sau parmezan ras si busuioc proaspat pentru servit.', 'Intr-o tava asezam rosiile cherry; printre ele punem si cateii de usturoi intregi in coaja, baconul taiat fideluta, presaram frunzulitele de oregano si stropim cu ulei de masline. Dam tava la cuptor 25 minute la 200 grade C. Intre rosii facem loc la bucatile de pui, presaram si maslinele intregi.Adaugam vinul. Condimentam cu sare si piper, mai stropim cu putin ulei de masline. Dam din nou la cuptor pentru 30-45 de minute sau pana cand puiul este frumos rumenit.', 'Pe farfurie asezam o bucata carne de pui, bacon, rosii, usturoi, masline si presaram cascaval ras precum si busuioc proaspat.'),
(8, 'Friptura de porc', '800 gr cotlet de porc fara os sau pulpa de porc -200 ml bere -2 lingurite miere -6 catei de usturoi -chili -sare -piper -rozmarin -sos soia -sos worcester -ghimbir 1 lingurita rasa -sfoara pentru fritura', 'Pulpa de porc se spala, se fac mici intepaturi cu ajutorul unui cutit si se introduce usturoiul taiat feliute( in cazul in care folositi un cotlet de porc), eu am folosit pulpa asa ca aceasta nu era uniforma am umplut-o cu feliute de usturoi si am legat-o cu sfoara de bucatarie pentru ai da o forma .  Se condimenteaza carnea cu foarte putina sare , piper , chili si rozmarin . Se amesteca in vasul in care vom gati sosul de soia aproximativ 2 linguri , berea, sos worcester o lingurita de gimbir ra', 'Friptura de porc se serveste calda.'),
(9, 'Gratar de pui cu orez', 'un piept de pui, sare, piper, boia dulce, 50ml ulei, o ceasca orez, o ceapa, un morcov', '-carnea se taie felii, se condimenteaza, apoi se pune pe gril -se caleste ceapa taiata marunt, apoi se adauga morcovul taiat felii, adaugand 2linguri de apa pentru a se inabusi -se adauga orezul si 3cesti apa calda si se fierbe -se condimenteaza cu sare si piper', 'cu salata de varza'),
(10, 'Ardei umpluti', '600g carne de porc si vita tocata ardei grasi 8 buc. 4 linguri orez 1 ceapa mare 2 frunze dafin patrunjel si marar verde tocat 1 morcov mic dat pe razatoare 300 ml bulion sare, piper', 'Ceapa o tocam marunt si o calim impreuna cu morcovul. Adaugam si orezul, lasam 1 minut sa se prajeasca putin apoi rasturnam amestecul peste carne. Adaugam sare, piper si verdeata tocata. Spalam ardeii bine apoi scoatem capacelul, dupa care ii umplem. Intr-o cratita punem putin ulei apoi asezam ardeii si deasupra turnam bulionul si apa pana sunt acoperiti . Dafinul il punem printre ardei. Pe fiecare ardei punem o feliuta de rosie, acoperim cu un capac si apoi lasam sa fiarba la foc mic timp de 90', 'Se servesc cu smantana.');

-- --------------------------------------------------------

--
-- Table structure for table `RECIPE_INGREDIENT`
--

CREATE TABLE IF NOT EXISTS `RECIPE_INGREDIENT` (
  `ID_RECIPE` int(10) unsigned NOT NULL,
  `ID_INGREDIENT` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID_RECIPE`,`ID_INGREDIENT`),
  KEY `ID_INGREDIENT` (`ID_INGREDIENT`),
  KEY `ID_RECIPE` (`ID_RECIPE`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `RECIPE_INGREDIENT`
--

INSERT INTO `RECIPE_INGREDIENT` (`ID_RECIPE`, `ID_INGREDIENT`) VALUES
(1, 1),
(5, 1),
(3, 3),
(6, 4),
(2, 5),
(3, 5),
(9, 5),
(1, 6),
(2, 6),
(3, 6),
(4, 6),
(3, 7),
(10, 9),
(2, 12),
(2, 13),
(5, 13),
(7, 13),
(9, 13),
(3, 14),
(4, 14),
(6, 14),
(4, 17),
(5, 17),
(3, 19),
(10, 20),
(3, 21),
(1, 23),
(4, 23),
(7, 23),
(1, 24),
(7, 26),
(6, 27),
(8, 27),
(6, 29),
(7, 29),
(1, 31),
(2, 31),
(5, 31),
(6, 31),
(8, 31),
(9, 31),
(10, 31),
(1, 32),
(2, 32),
(5, 32),
(6, 32),
(7, 32),
(8, 32),
(9, 32),
(10, 32),
(6, 33),
(7, 33),
(6, 34),
(2, 35),
(3, 35),
(5, 35),
(9, 35),
(10, 35),
(3, 36),
(5, 36),
(7, 36),
(8, 36),
(5, 37),
(2, 38),
(5, 38),
(10, 38),
(5, 39),
(5, 40),
(5, 41),
(5, 42),
(4, 43),
(4, 44),
(4, 45),
(1, 47),
(2, 47),
(3, 47),
(9, 47),
(1, 48),
(1, 49),
(7, 49),
(2, 50),
(10, 50),
(7, 52),
(7, 53),
(7, 55),
(8, 56),
(8, 57),
(8, 58),
(8, 59),
(8, 60),
(8, 61),
(9, 62),
(10, 62),
(10, 64),
(10, 65),
(6, 80),
(1, 81),
(8, 81),
(10, 81);

-- --------------------------------------------------------

--
-- Table structure for table `USER`
--

CREATE TABLE IF NOT EXISTS `USER` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `USER_NAME` varchar(100) NOT NULL,
  `PASS` varchar(100) NOT NULL,
  `NR_QUIZ_TOTAL` int(10) NOT NULL,
  `NR_QUIZ_WON` int(10) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `HISTORY`
--
ALTER TABLE `HISTORY`
  ADD CONSTRAINT `HISTORY_ibfk_1` FOREIGN KEY (`ID_USER`) REFERENCES `USER` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `HISTORY_ibfk_2` FOREIGN KEY (`ID_RECIPE`) REFERENCES `RECIPE` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `RECIPE_INGREDIENT`
--
ALTER TABLE `RECIPE_INGREDIENT`
  ADD CONSTRAINT `RECIPE_INGREDIENT_ibfk_2` FOREIGN KEY (`ID_INGREDIENT`) REFERENCES `INGREDIENT` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `RECIPE_INGREDIENT_ibfk_3` FOREIGN KEY (`ID_RECIPE`) REFERENCES `RECIPE` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
