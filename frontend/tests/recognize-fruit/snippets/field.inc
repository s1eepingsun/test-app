    <div class="gameArea" id="gameArea">
        <div class="titleBand">
            <div class="titleBandInner">
                <table cellspacing="0" cellpadding="0" width="100%" border="0">
                    <tbody>
                    <tr>
                        <td width="1%" style="white-space: nowrap;">
                                <span class="titleBandLink" id="title">
                                    Тест на знание фруктов
                                </span>
                        </td>

                        <td>&nbsp;</td>

                        <td width="1%" align="center" style="white-space: nowrap;">
                                <span class="titleBandLink" id="showDescription">
                                    Описание
                                </span>
                        </td>

                        <!--<td>&nbsp;</td>

                        <td width="1%" align="" style="white-space: nowrap;">
                                <span class="titleBandLink" id="showDescription">
                                      Формулы
                                </span>
                        </td>-->

                        <td>&nbsp;</td>

                        <td width="1%" align="right" style="white-space: nowrap;">
                                <span id="gbShow" class="titleBandLink">
                                    Вопросы и отзывы
                                </span>
                        </td>

                        <td>&nbsp;</td>

                        <td width="1%" align="right" style="white-space: nowrap;">
                            <a href="/" class="titleBandLink">
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
                    <!--<td id="tb-prev-task" class="cpButton cpNormal nonSelectable disabled">Предыдущий<br>вопрос</td>
                    <td id="tb-next-task" class="cpButton cpNormal nonSelectable  disabled">Следующий<br>вопрос</td>-->
                    <!--<td id="tb-help-info" class="cpButton cpNormal">Формулы</td>-->
                    <td id="tb-training" class="cpButton cpNormal">Тренировка</td>
                    <td id="tbNewGameContainer" class="cpButton  nonSelectable cpKillHover">
                        <table style="width: 100%; height: 100%;" cellspacing="0" cellpadding="0">
                            <tbody>
                            <tr>
                                <td id="tbPreviousGame" style="border-right: 1px solid #BBB; width: 15px;" class="cpNormal roundedLeft4px">
                                    &lt;
                                </td>
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
            <?php include '../../controllers/testMain.php'; ?>
        </div>

        <div id="bottom-task-list">
        </div>

        <!-- BOTTOM BUTTONS -->
        <div class="controlPanel nonSelectable">
            <table class="controlPanelLayout">
                <tr>
                    <td id="bbParameters" class="cpButton cpNormal nonSelectable">
                        <?=$i18n->get("bottomCP", "parameters")?>
                    </td>
                    <td id="bbTestList" class="cpButton cpNormal nonSelectable">
                        Список тестов
                    </td>
                    <td id="bbHistory" class="cpButton cpNormal nonSelectable disabled">
                        <?=$i18n->get("bottomCP", "history")?>
                    </td>
                    <td id="bbRatings" class="cpButton cpNormal nonSelectable disabled"><?=$i18n->get("bottomCP", "rating")?></td>
                    <td id="bbLoginRegister"
                        class="cpButton cpNormal nonSelectable" <?php echo $displayNotLogged; ?>>
                        <?=$i18n->get("bottomCP", "loginRegister")?>
                    </td>
                    <td id="bbProfile" class="cpButton cpNormal nonSelectable" <?php echo $displayLogged; ?>>
                        <span id="bbProfileLabel"><?=$i18n->get("bottomCP", "profile")?></span> <span id="bbUnreadMsgCount"></span>
                    </td>
                </tr>
            </table>
        </div>

        <!-- HELP INFO -->
        <div id="reference-book-wrapper">
            <div class="close-reference-book"><img src="/img/icons/icon_close.png"></div>
        </div>

        <div id="test-list-wrapper">
        </div>


    </div>


