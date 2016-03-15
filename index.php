<!DOCTYPE html>
<head>
    <title>Folder Structure Viewer</title>
    <link rel="stylesheet" href="css/style.css" type="text/css">
</head>

<body>
    <div id="logo">
        <h1 id="page-title">
            Folder Structure Viewer with Drag & Drop Option
        </h1>
    </div>
    <div class="wrapper">
        <div id="sidebar"></div>
        <div class="content">
            <div class="disk-selector">
                <?php
                // show existing dir-s
                $a = range("A", "Z");
                echo "Show: <select class='disks form-control'>";
                foreach($a as $l){
                    if(is_dir("$l:/")) echo ("<option value=$l>$l</option>");
                }
                echo '</select>';
                ?>
            </div>
        </div>
        <div class="clear"></div>
    </div>
    <div class="footer"><span style='color:red'>Agium</span> Task <br/> Made By Armen Avetisyan</div>
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/script.js"></script>
</body>

</html>

<?php
if(isset($_POST['targetPath']) && isset($_POST['selectedItemPath'])){

    $sip = $_POST['selectedItemPath'];
    $tp  = $_POST['targetPath'];

    if($sip != tp) {
        $sipfileName = basename($sip); // get file/dir name
        rename($sip, $tp.$sipfileName);
    }
}
?>
