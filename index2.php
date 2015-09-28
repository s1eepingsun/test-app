<?php
// ID игры уже определен в общих классах, и выглядит он так
define("YOURGAME_ID", 666);

require_once("../sharedAPI/LogicGameSessionManager.php");
require_once("../sharedAPI/LogicGameLocalization.php");
require_once("../sharedAPI/LogicGameVkAuth.php");
require_once("../sharedAPI/LogicGameResourceManager.php");

// версия клиентских файлов css и js, для кеша
$v .= '10';

$sm = new LogicGameSessionManager(YOURGAME_ID);
$s = $sm->getAuthServerInstance();
$s->updateActivity();

// Vk auth
$isVk = false;
$vkAuth = new LogicGameVkAuth($s, $sm);
$vkAuth->tryVkAuth();
$isVk = $vkAuth->hasVkAuth();

$isFreshUser = $sm->isFreshUser();
$i18n = $s->getI18n();

?>
<!DOCTYPE html>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Тест Математика</title>
    <link rel="shortcut icon" type="image/x-icon" href="http://logic-games.spb.ru/freecell/favicon.ico">

    <script type="text/javascript">
        var _sessionId = "<?php echo $s->getSessionId(); ?>";
        var _userId = <?php echo $s->getUserId(); ?>;
        var _username = "<?php echo $s->getUsername(); ?>";
        var _sign = "<?php echo $s->getSign('test_salt');  ?>";
        var _isGuest = <?php if ($s->isGuest()) echo "true"; else echo "false"; ?>;
        var _gameVariationId = <?php echo $s->getGameVariationId(); ?>;
        var _isFreshUser = <?php echo $isFreshUser ? 'true' : 'false'; ?>;
        var _isVk = <?php echo $isVk ? 'true' : 'false'; ?>;
    </script>
    <?php
    if(!$isVk) echo '<script src="//vk.com/js/api/openapi.js" type="text/javascript"/></script>';
    echo "<script type='text/javascript' src='/js/build/public-main.min.js?v=$v'></script> \n\r";
    echo "<script type='text/javascript' src='/js/build/shared-main.js?v=$v'></script> \n\r";
    echo "<script type='text/javascript' src='/js/lang/lang.".$s->getI18n()->get("locale", "id").".js?v=$v'></script> \n\r";
    echo "<link media='screen' href='/css/build/shared.css?v=$v' rel='stylesheet' type='text/css'>\n\r";
    ?>

    <!-- assigning php data to js variable -->
    <?php include 'controllers/testDataToJS.php'; ?>

    <!-- css -->
    <link media="screen" href="./Example_files/game-layout.css" rel="stylesheet" type="text/css">
    <link media="screen" href="css/test-main.css" rel="stylesheet" type="text/css">

    <!-- thrid-party libraries -->
    <script type="text/javascript" src="js/libs/handlebars-v3.0.3.js"></script>
    <script type="text/javascript" src="../mathjax/MathJax.js?config=TeX-AMS_HTML"></script>

    <!-- modules -->
    <script type="text/javascript" src="js/Timer.js"></script>
    <script type="text/javascript" src="js/models/TestModel.js"></script>
    <script type="text/javascript" src="js/views/ListView.js"></script>
    <script type="text/javascript" src="js/views/MainView.js"></script>
    <script type="text/javascript" src="js/controllers/TestController.js"></script>

    <!-- application core (should be positioned after modules) -->
    <script type="text/javascript" src="js/main2.js"></script>
</head>
<body>

<!-- MAIN -->
<table class="mainLayout" cellspacing="0" cellpadding="0">
<tbody><tr>
<td class="gameAreaLayout">

<div class="gameArea" id="gameArea">
    <div id="left-side-bar">
    <?php include 'controllers/testSidebar.php'; ?>
    </div>
    <!-- TOP LINKS -->
    <div class="titleBand">
        <div class="titleBandInner">
            <table cellspacing="0" cellpadding="0" width="100%" border="0">
                <tbody>
                <tr>
                    <td width="1%" style="white-space: nowrap;">
                            <span class="titleBandLink" id="title">
                                ЕГЭ по математике
                            </span>
                    </td>

                    <td>&nbsp;</td>

                    <td width="1%" align="center" style="white-space: nowrap;">
                            <span class="titleBandLink" id="showDescription">
                                Описаниие
                            </span>
                    </td>

                    <td>&nbsp;</td>

                    <td width="1%" align="center" style="white-space: nowrap;">
                            <span id="gbShow" class="titleBandLink">
                                Вопросы и отзывы
                            </span>
                    </td>

                    <td>&nbsp;</td>

                    <td width="1%" align="right" style="white-space: nowrap;">
                        <a href="/" class="titleBandLink" <?= (isset($isVk) && $isVk ? " target='_blank'" : "") ?>>
                            Перейти на другие игры
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- TOP BUTTONS -->
    <div class="controlPanel top-c-panel nonSelectable">
        <table class="controlPanelLayout" cellpadding="0">
            <tbody>
            <tr>
                <td id="tb-prev-task" class="cpButton cpNormal nonSelectable disabled">Предыдущий вопрос</td>
                <td id="tb-next-task" class="cpButton cpNormal nonSelectable disabled">Следующий вопрос</td>
                <td id="tbNewGameContainer" class="cpButton cpNormal nonSelectable cpKillHover">
                    <table style="width: 100%; height: 100%;" cellspacing="0" cellpadding="0">
                        <tbody>
                        <tr>
                            <td id="tb-new-test" class="cpNormal roundedRight4px">Новый тест</td>
                        </tr>
                        </tbody>
                    </table>
                </td>
                <td id="tb-finish-test" class="cpButton cpNormal nonSelectable disabled">Закончить тест</td>
            </tr>
            </tbody>
        </table>
    </div>

    <!-- GAME FIELD !! важно чтобы был див с таким айдишников и центрированием, относительного него и будет центрироваться блок с авторизацией !!-->
    <div id="field">
    <?php include 'controllers/testMain.php'; ?>
    </div>

    <!-- BOTTOM BUTTONS -->
    <div class="controlPanel nonSelectable">
        <table class="controlPanelLayout">
            <tbody>
            <tr>
                <td id="bbParameters" class="cpButton cpNormal nonSelectable disabled">Параметры</td>
                <td id="bbHistory" class="cpButton cpNormal nonSelectable disabled">История</td>
                <td id="bbRatings" class="cpButton cpNormal nonSelectable disabled">Рейтинг</td>
                <td id="bbLoginRegister" class="cpButton cpNormal nonSelectable" style="display: none;"> Авторизация</td>
                <td id="bbProfile" class="cpButton cpNormal nonSelectable"> <span id="bbProfileLabel">Личный кабинет</span> <span id="bbUnreadMsgCount"></span> </td>
            </tr>
            </tbody>
        </table>
    </div>

    <!-- INCLUDE AUTHFORM  !! обязательно для включения, в блоке, с центрированием !! -->
    <?php include '../snippets/lg-login-register.htm'; ?>
</div>


<!-- BOTTOM AREA AND PANELS !! обязательно для включения, в блоке, с центрированием !! -->
    <div class="bottomArea" id="bottomArea">
        <?php
        include '../snippets/lg-profile.htm';
        include '../snippets/lg-guestbook.htm';
        ?>
    </div>
</td>
</tr>

<!-- FOOTER STATS  -->
<tr>
    <td style="text-align: center; padding-bottom: 10px;">
        <!-- !! обязательно для включения, в блоке, с центрированием !! -->
        <?php
        include '../snippets/lg-activity.htm';
        ?>
    </td>
</tr>
</tbody></table>
</body></html>