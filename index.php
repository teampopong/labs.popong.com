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
		<ul>
		<?php foreach ($dirs as $dir) {
			echo '<li><a href="'.$dir.'">'.$dir.'</a></li>';
		} ?>
		</ul>
	</body>
</html>
