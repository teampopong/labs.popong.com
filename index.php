<?php

$exclude = array('.', '..', '.git');

function getDirNames() {
	global $exclude;

    $dir = './';
    if (is_dir($dir) && $dh = opendir($dir)) {
        while (($file = readdir($dh)) !== false) {
			if (is_dir($dir.$file) && !in_array($file, $exclude)) {
                $dirs[] = $file;
            }
        }
        closedir($dh);
    }
    return $dirs;
};

$dirs = getDirNames();
?>

<!DOCTYPE html>
<html>
	<head>
		<title>POPONG Labs</title>
		<meta charset="utf-8">
	</head>
	<body>
		<em><strong>NOTE</strong>: 지금은 알아볼 수 없는 이름으로 쓰여 있는데 곧 수정할게요 ;ㅁ;</em>
		<ul>
		<? foreach ($dirs as $dir) {
			echo '<li><a href="'.$dir.'">'.$dir.'</a></li>';
		} ?>
			<li><a href="data">data-explorer</a></li>
		</ul>
	</body>
</html>
