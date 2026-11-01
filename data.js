/* Inhalte: Übungsbibliothek, Einheiten, Programm, Körper-Check */
(function (W) {
  'use strict';

  const CAT = {
    uk: 'Beine & Gesäss',
    push: 'Drücken',
    pull: 'Ziehen',
    core: 'Rumpf',
    rot: 'Rotation',
    mob: 'Mobilität',
    bal: 'Balance & Kontrolle',
    cond: 'Kondition'
  };
  const EQ = {
    bw: 'Körpergewicht',
    bb: 'Langhantel',
    db: 'Kurzhanteln',
    ball: 'Gymnastikball',
    disc: 'Balancierscheibe'
  };
  // Tracking: wr = Gewicht x Wdh, r = Wdh, t = Zeit, wt = Gewicht x Zeit

  const EX = [];
  const ex = (id, name, cat, eq, track, m, cues, tip, o) => {
    o = o || {};
    EX.push({ id, name, cat, eq, track, m, cues, tip: tip || '', side: !!o.side });
  };

  /* ---------- Beine & Gesäss ---------- */
  ex('goblet_squat', 'Goblet Kniebeuge', 'uk', ['db'], 'wr', 'Quadrizeps, Gesäss, Rumpf',
    ['Kurzhantel mit beiden Händen vor der Brust halten', 'Füsse schulterbreit, Knie folgen den Zehen', 'Brust aufrecht, so tief wie sauber möglich', 'Mit Druck über die ganze Fusssohle aufstehen'],
    'Kniebeuge mit Gewicht vor dem Körper; das Gegengewicht erleichtert eine aufrechte Haltung.');
  ex('bb_squat', 'Langhantel Kniebeuge', 'uk', ['bb'], 'wr', 'Quadrizeps, Gesäss, Rumpf',
    ['Stange auf dem oberen Rücken, Rumpf fest', 'Hüfte und Knie gleichzeitig beugen', 'Rücken neutral, Fersen bleiben am Boden', 'Explosiv, aber kontrolliert aufstehen'],
    'Nur mit Ständer oder Hilfsperson laden. Ohne Ständer: Goblet Kniebeuge mit schwerer Kurzhantel wählen.');
  ex('bb_rdl', 'Rumänisches Kreuzheben', 'uk', ['bb'], 'wr', 'Beinbeuger, Gesäss, unterer Rücken',
    ['Stange eng am Körper führen', 'Hüfte nach hinten schieben, Knie nur leicht gebeugt', 'Rücken lang, Blick zum Boden', 'Oben das Gesäss fest anspannen'],
    'Hüftbeuge-Bewegung (Hip Hinge): Beinrückseite und Gesäss arbeiten, der Rücken bleibt neutral.');
  ex('bb_deadlift', 'Kreuzheben', 'uk', ['bb'], 'wr', 'Gesamte Rückseite, Griffkraft',
    ['Stange über Mitte Fuss, Schultern leicht vor der Stange', 'Spannung aufbauen, Stange „aus dem Boden drücken"', 'Hüfte und Schultern steigen gleichzeitig', 'Oben aufrecht, nicht überstrecken'],
    'Mit leichtem Gewicht die Technik festigen, bevor die Last steigt.');
  ex('rev_lunge', 'Ausfallschritt rückwärts', 'uk', ['db'], 'wr', 'Quadrizeps, Gesäss, Balance',
    ['Kurzhanteln seitlich halten', 'Grosser Schritt nach hinten, Oberkörper aufrecht', 'Vorderes Knie bleibt über dem Fuss', 'Über die vordere Ferse zurückdrücken'],
    'Beim Schritt nach hinten bleibt der Schwerpunkt über dem vorderen Bein.', { side: true });
  ex('bulgarian', 'Bulgarian Split Squat', 'uk', ['db', 'ball'], 'wr', 'Quadrizeps, Gesäss, Balance',
    ['Hinterer Fuss liegt auf dem Gymnastikball (oder Sofa)', 'Oberkörper leicht nach vorn, Gewicht auf dem vorderen Bein', 'Senkrecht nach unten gehen', 'Vorderer Fuss bleibt voll am Boden'],
    'Einbeinige Kniebeuge: Der Hinterfuss dient nur zur Stütze, die Last trägt das vordere Bein.', { side: true });
  ex('lat_lunge', 'Seitlicher Ausfallschritt', 'uk', ['bw', 'db'], 'wr', 'Adduktoren, Gesäss, Hüftmobilität',
    ['Grosser Schritt zur Seite, Zehen zeigen nach vorn', 'Hüfte nach hinten setzen, das andere Bein bleibt gestreckt', 'Brust bleibt aufrecht', 'Kraftvoll zurück in die Mitte'],
    'Beinarbeit in der Seitwärtsbewegung (Frontalebene).', { side: true });
  ex('sl_rdl', 'Einbeiniges Kreuzheben', 'uk', ['db'], 'wr', 'Beinbeuger, Gesäss, Fussstabilität',
    ['Standbein leicht gebeugt, Hantel in Gegenhand', 'Hüfte nach hinten schieben, freies Bein bildet eine Linie mit dem Rücken', 'Hüften bleiben parallel zum Boden', 'Mit Gesäss aufrichten'],
    'Einbeinige Hüftbeuge; fordert Gleichgewicht und Hüftkontrolle.', { side: true });
  ex('hip_thrust', 'Hip Thrust (Schultern auf Ball)', 'uk', ['ball', 'db', 'bb'], 'wr', 'Gesäss, Beinbeuger',
    ['Oberer Rücken liegt auf dem Gymnastikball', 'Hantel auf der Hüfte, Füsse hüftbreit', 'Hüfte nach oben strecken, Kinn zur Brust', 'Oben 1 Sekunde Spannung halten'],
    'Hüftstreckung mit Schwerpunkt auf dem Gesäss.');
  ex('ball_curl', 'Beinbeuger auf dem Ball', 'uk', ['ball'], 'r', 'Beinbeuger, Gesäss, Rumpf',
    ['Rücken liegt am Boden, Fersen auf dem Ball', 'Hüfte anheben und Ball mit den Fersen heranrollen', 'Hüfte bleibt oben', 'Langsam wieder ausrollen'],
    'Kniebeugung und Hüftstreckung in einer Bewegung; trainiert die Beinrückseite.');
  ex('ball_bridge', 'Hüftbrücke, Fersen auf Ball', 'uk', ['ball'], 'r', 'Gesäss, Beinbeuger, Rumpf',
    ['Fersen auf den Ball, Arme neben dem Körper', 'Hüfte heben, bis Schultern–Hüfte–Knie eine Linie bilden', 'Ball ruhig halten', '2 Sekunden oben halten'],
    'Einfachere Vorstufe des Beinbeugers auf dem Ball.');
  ex('wall_sit', 'Wandsitzen mit Ball', 'uk', ['ball'], 't', 'Quadrizeps, Gesäss',
    ['Ball zwischen Rücken und Wand', 'Oberschenkel waagrecht, Knie über den Knöcheln', 'Gewicht auf den Fersen', 'Gleichmässig atmen'],
    'Isometrische Kraftausdauer der Beinmuskulatur.');
  ex('cossack', 'Cossack Squat', 'uk', ['bw', 'db'], 'r', 'Adduktoren, Gesäss, Hüftmobilität',
    ['Sehr breiter Stand, Zehen leicht nach aussen', 'Auf eine Seite absenken, das andere Bein gestreckt, Zehen zeigen nach oben', 'Ferse des gebeugten Beins bleibt am Boden', 'Zur anderen Seite wechseln'],
    'Tiefe Kniebeuge zur Seite; fordert die Beweglichkeit der Hüfte (Adduktoren).', { side: true });
  ex('calf_raise', 'Wadenheben einbeinig', 'uk', ['db'], 'wr', 'Waden, Fussstabilität',
    ['Mit einer Hand an der Wand abstützen', 'Ganz nach oben, kurz halten', 'Langsam absenken, Ferse unter Fussspitzen', 'Hantel in der freien Hand'],
    'Trainiert die Wadenmuskulatur.', { side: true });

  /* ---------- Drücken ---------- */
  ex('pushup', 'Liegestütz', 'push', ['bw'], 'r', 'Brust, Schulter, Trizeps, Rumpf',
    ['Körper bildet eine gerade Linie', 'Ellbogen ca. 45° zum Körper', 'Brust fast zum Boden', 'Bauch und Gesäss fest'],
    'Auf den Knien beginnen, falls die saubere Ausführung noch nicht möglich ist.');
  ex('pushup_ball', 'Liegestütz, Füsse auf Ball', 'push', ['ball'], 'r', 'Brust, Schulter, Rumpf',
    ['Unterschenkel oder Füsse auf dem Ball', 'Körper bleibt gerade, kein Hohlkreuz', 'Langsam absenken', 'Ball ruhig halten'],
    'Die instabile Unterlage erhöht den Anspruch an die Rumpfspannung.');
  ex('pushup_disc', 'Liegestütz, Hände auf Scheibe', 'push', ['disc'], 'r', 'Brust, Schulter, Schulterstabilität',
    ['Beide Hände auf der Balancierscheibe', 'Scheibe möglichst ruhig halten', 'Schulterblätter aktiv stabilisieren', 'Kontrolliert absenken und drücken'],
    'Die instabile Unterlage erhöht den Anspruch an die Schulterkontrolle.');
  ex('db_press_ball', 'Kurzhantel Drücken auf Ball', 'push', ['db', 'ball'], 'wr', 'Brust, Schulter, Trizeps, Rumpf',
    ['Oberer Rücken liegt auf dem Ball, Hüfte oben', 'Hanteln über der Brust, Ellbogen ca. 45°', 'Gleichmässig drücken', 'Hüfte bleibt die ganze Zeit oben'],
    'Die instabile Unterlage erhöht den Anspruch an die Rumpfspannung.');
  ex('bb_floorpress', 'Langhantel Floor Press', 'push', ['bb'], 'wr', 'Brust, Trizeps, Schulter',
    ['Auf dem Boden liegen, Knie angewinkelt', 'Stange kontrolliert absenken, bis Oberarme den Boden berühren', 'Kurz pausieren, dann drücken', 'Handgelenke gerade'],
    'Der Boden begrenzt die Bewegungstiefe nach unten.');
  ex('bb_ohp', 'Langhantel Schulterdrücken', 'push', ['bb'], 'wr', 'Schulter, Trizeps, Rumpf',
    ['Stand schulterbreit, Gesäss und Bauch fest', 'Stange aus der Schulterposition senkrecht nach oben', 'Kopf kurz nach hinten, dann unter der Stange durch', 'Oben die Schultern aktiv hochschieben'],
    'Kein Hohlkreuz; der Rumpf stabilisiert die Last.');
  ex('db_ohp', 'Kurzhantel Schulterdrücken', 'push', ['db'], 'wr', 'Schulter, Trizeps',
    ['Hanteln auf Schulterhöhe, Handflächen nach vorn', 'Gerade nach oben drücken', 'Rumpf bleibt stabil', 'Kontrolliert absenken'],
    'Beide Arme arbeiten unabhängig voneinander.');
  ex('half_kneel_press', 'Halbkniendes Einarm-Drücken', 'push', ['db'], 'wr', 'Schulter, Rumpf, Hüftstabilität',
    ['Ein Knie am Boden, Hüfte aufrecht', 'Gesäss des knienden Beins anspannen', 'Hantel senkrecht nach oben drücken', 'Rumpf bleibt gerade'],
    'Die halbkniende Position verkleinert die Standfläche und fordert Rumpf und Hüfte.', { side: true });
  ex('tri_ext', 'Trizepsstrecken über Kopf', 'push', ['db'], 'wr', 'Trizeps',
    ['Eine Kurzhantel mit beiden Händen über dem Kopf', 'Ellbogen zeigen nach vorn', 'Hantel hinter den Kopf absenken', 'Nur im Ellbogen bewegen'],
    '');

  /* ---------- Ziehen ---------- */
  ex('bb_row', 'Langhantel Rudern vorgebeugt', 'pull', ['bb'], 'wr', 'Oberer Rücken, Latissimus, Bizeps',
    ['Hüfte nach hinten, Oberkörper ca. 45° geneigt', 'Stange zum Bauchnabel ziehen', 'Schulterblätter zusammenführen', 'Rücken bleibt lang'],
    'Horizontaler Zug für oberen Rücken und Latissimus.');
  ex('db_row', 'Einarm Kurzhantel Rudern', 'pull', ['db'], 'wr', 'Latissimus, oberer Rücken, Bizeps',
    ['Eine Hand und das gleichseitige Knie stützen ab (Sofa)', 'Hantel zur Hüfte ziehen', 'Rumpf rotiert nicht mit', 'Unten Schulterblatt strecken'],
    '', { side: true });
  ex('ball_row', 'Rudern, Brust auf Ball', 'pull', ['db', 'ball'], 'wr', 'Oberer Rücken, hintere Schulter',
    ['Bauch/Brust liegt auf dem Ball, Füsse stabil', 'Hanteln mit Ellbogen nach hinten ziehen', 'Schulterblätter zusammen', 'Kein Schwung aus dem Rücken'],
    'Die Brustauflage entlastet den unteren Rücken.');
  ex('renegade', 'Renegade Row', 'pull', ['db'], 'wr', 'Rumpf, Rücken, Schulterstabilität',
    ['Liegestützposition auf zwei Hanteln, Füsse breit', 'Hüfte bleibt ruhig, keine Rotation', 'Eine Hantel zur Hüfte rudern', 'Wechseln'],
    'Der Rumpf soll Rotation verhindern (Anti-Rotation).', { side: true });
  ex('rear_fly', 'Reverse Fly vorgebeugt', 'pull', ['db'], 'wr', 'Hintere Schulter, oberer Rücken',
    ['Hüfte nach hinten, Rücken gerade', 'Arme leicht gebeugt seitlich anheben', 'Schulterblätter zusammen', 'Leichtes Gewicht, saubere Technik'],
    'Trainiert hintere Schulter und oberen Rücken.');
  ex('db_curl', 'Bizeps Curl', 'pull', ['db'], 'wr', 'Bizeps, Unterarm',
    ['Ellbogen am Körper fixieren', 'Kein Schwung', 'Oben kurz anspannen', 'Langsam absenken'], '');
  ex('ball_superman', 'Rückenstrecker auf dem Ball', 'pull', ['ball'], 'r', 'Rückenstrecker, Gesäss',
    ['Bauch liegt auf dem Ball, Füsse stabil', 'Oberkörper gerade bis zur Linie anheben', 'Nicht ins Hohlkreuz', 'Arme neben dem Kopf oder an den Schläfen'],
    'Trainiert Rückenstrecker und Gesäss.');
  ex('ytw', 'Y-T-W Raises', 'pull', ['bw'], 'r', 'Schulterblatt, Rotatorenmanschette',
    ['Bauchlage, Stirn am Boden', 'Arme in Y, T und W nacheinander anheben', 'Daumen zeigen nach oben', 'Ohne Gewicht, langsam'],
    'Leichte Übung für die Muskulatur um das Schulterblatt.');

  /* ---------- Rumpf ---------- */
  ex('plank', 'Plank (Unterarmstütz)', 'core', ['bw'], 't', 'Gesamter Rumpf',
    ['Ellbogen unter den Schultern', 'Körper bildet eine Linie', 'Gesäss und Bauch fest', 'Gleichmässig atmen'], '');
  ex('ball_stir', 'Stir the Pot', 'core', ['ball'], 't', 'Rumpf, Schulterstabilität',
    ['Unterarme auf dem Ball, Plankposition', 'Mit den Unterarmen kleine Kreise zeichnen', 'Hüfte bleibt ruhig', 'Kreisrichtung nach der Hälfte wechseln'],
    'Die instabile Unterlage erhöht den Anspruch an die Rumpfspannung.');
  ex('side_plank', 'Seitstütz', 'core', ['bw'], 't', 'Seitliche Bauchmuskeln, Hüfte',
    ['Ellbogen unter der Schulter', 'Hüfte hoch, Körper bildet eine Linie', 'Oberen Arm zur Decke oder an die Hüfte', 'Nicht nach vorn oder hinten kippen'],
    'Trainiert die seitliche Rumpfmuskulatur.', { side: true });
  ex('deadbug', 'Dead Bug', 'core', ['bw'], 'r', 'Tiefe Bauchmuskeln, Rumpfkontrolle',
    ['Rückenlage, Arme zur Decke, Knie 90°', 'Unterer Rücken bleibt am Boden', 'Gegenarm und Gegenbein langsam strecken', 'Ausatmen beim Strecken'],
    'Arme und Beine bewegen sich, während der Rumpf stabil bleibt.');
  ex('ball_deadbug', 'Dead Bug mit Ball', 'core', ['ball'], 'r', 'Tiefe Bauchmuskeln',
    ['Ball zwischen Händen und Knien', 'Gegenarm/Gegenbein strecken, Ball bleibt', 'Unterer Rücken am Boden', 'Langsam und kontrolliert'], '');
  ex('birddog', 'Bird Dog', 'core', ['bw'], 'r', 'Rumpf, Rücken, Gesäss',
    ['Vierfüsslerstand, Rücken neutral', 'Gegenarm und Gegenbein strecken', '2 Sekunden halten', 'Becken bleibt ruhig'],
    'Gegenarm und Gegenbein bewegen sich bei stabilem Rumpf.', { side: true });
  ex('ball_rollout', 'Ball Rollout', 'core', ['ball'], 'r', 'Bauch, Rumpf, Schulter',
    ['Kniend, Unterarme auf dem Ball', 'Ball nach vorn rollen, Körper bleibt gerade', 'Bauch fest, kein Hohlkreuz', 'Mit Rumpfkraft zurückziehen'],
    'Hoher Anspruch an die Bauchspannung; Hohlkreuz vermeiden.');
  ex('hollow', 'Hollow Hold', 'core', ['bw'], 't', 'Gerade Bauchmuskeln',
    ['Rückenlage, unterer Rücken am Boden', 'Schultern und gestreckte Beine anheben', 'Arme über dem Kopf', 'Zu schwer? Knie anwinkeln'], '');
  ex('jackknife', 'Jackknife auf Ball', 'core', ['ball'], 'r', 'Bauch, Hüftbeuger, Schulter',
    ['Liegestütz, Unterschenkel auf dem Ball', 'Hüfte nach oben schieben, Ball heranrollen', 'Beine bleiben gestreckt', 'Langsam zurück'],
    'Anspruchsvolle Variante; erst nach Plank und Rollout versuchen.');
  ex('plank_tap', 'Plank Schulter-Tap', 'core', ['bw'], 'r', 'Rumpf, Anti-Rotation',
    ['Hohe Plank, Füsse breit', 'Abwechselnd Hand zur Gegenschulter', 'Hüfte schaukelt nicht', 'Langsam'], '', {});
  ex('russian_twist', 'Russian Twist', 'core', ['db'], 'wr', 'Schräge Bauchmuskeln',
    ['Sitz, Oberkörper leicht zurück, Füsse am Boden', 'Hantel vor der Brust', 'Aus dem Rumpf rotieren', 'Rücken lang'], '');
  ex('farmer', 'Farmer Walk', 'core', ['db'], 'wt', 'Rumpf, Griffkraft, Schultern',
    ['Zwei schwere Kurzhanteln', 'Aufrecht gehen, Schultern tief', 'Kleine, ruhige Schritte', 'Rumpf fest'], '');
  ex('suitcase', 'Suitcase Carry', 'core', ['db'], 'wt', 'Seitliche Rumpfmuskulatur, Griffkraft',
    ['Eine schwere Hantel in einer Hand', 'Aufrecht bleiben, nicht zur Seite kippen', 'Ruhige Schritte', 'Seite wechseln'],
    'Der Rumpf arbeitet gegen seitliches Kippen.', { side: true });

  /* ---------- Rotation ---------- */
  ex('landmine_rot', 'Landmine Rotation', 'rot', ['bb'], 'wr', 'Schräge Bauchmuskeln, Hüfte, Schulter',
    ['Ende der Langhantel in einer Zimmerecke (mit Handtuch) fixieren', 'Stange mit beiden Händen vor der Brust', 'Aus Hüfte und Rumpf zur Seite schwingen', 'Füsse drehen mit, Arme bleiben gestreckt'],
    'Rotationsübung gegen Widerstand.', { side: true });
  ex('woodchop', 'Kurzhantel Woodchop', 'rot', ['db'], 'wr', 'Schräge Bauchmuskeln, Hüfte',
    ['Hantel diagonal von oben aussen nach unten innen führen', 'Hüfte und Füsse rotieren mit', 'Arme bleiben fast gestreckt', 'Kontrolliert zurück'],
    'Diagonale Rotationsbewegung mit Hantel.', { side: true });
  ex('stick_rot', 'Rumpfrotation mit Stange', 'rot', ['bb'], 'r', 'Rumpf, Brustwirbelsäule, Hüfte',
    ['Langhantel (leer) oder Stab auf den Schultern', 'Hüftbeuge wie im Golf-Setup', 'Oberkörper drehen, Becken bleibt stabil', 'Wechselseitig, ruhiges Tempo'],
    'Rotation des Oberkörpers bei stabiler Hüfte.');
  ex('ball_seated_rot', 'Rotation sitzend auf Ball', 'rot', ['ball'], 'r', 'Rumpf, Wirbelsäulenmobilität',
    ['Aufrecht auf dem Ball sitzen', 'Arme vor der Brust verschränkt', 'Oberkörper drehen, Becken ruhig', 'Blick folgt der Bewegung'], '', {});

  /* ---------- Mobilität ---------- */
  ex('worlds_greatest', 'World’s Greatest Stretch', 'mob', ['bw'], 'r', 'Hüfte, Brustwirbelsäule, Beinrückseite',
    ['Grosser Ausfallschritt, Hände neben dem Fuss', 'Ellbogen zur Fussinnenseite senken', 'Arm zur Decke öffnen', 'Hinteres Bein gestreckt, Gesäss fest'],
    'Kombinierte Mobilisation von Hüfte, Brustwirbelsäule und Beinrückseite.', { side: true });
  ex('catcow', 'Katze–Kuh', 'mob', ['bw'], 'r', 'Wirbelsäule',
    ['Vierfüsslerstand', 'Einatmen: Hohlkreuz, Blick nach vorn', 'Ausatmen: Rücken rund, Kinn zur Brust', 'Langsam, Welle durch die Wirbelsäule'], '');
  ex('thread', 'Thread the Needle', 'mob', ['bw'], 'r', 'Brustwirbelsäule, Schulter',
    ['Vierfüsslerstand', 'Einen Arm unter dem Körper durchführen', 'Schulter und Ohr zum Boden senken', 'Danach den Arm zur Decke öffnen'],
    '', { side: true });
  ex('hipflexor', 'Hüftbeuger-Dehnung kniend', 'mob', ['bw'], 't', 'Hüftbeuger, Oberschenkelvorderseite',
    ['Ein Knie am Boden, anderer Fuss vorn', 'Gesäss anspannen, Becken nach vorn kippen', 'Oberkörper aufrecht', 'Gleichmässig atmen'],
    'Dehnung der Hüftbeuger.', { side: true });
  ex('frog', 'Frog Stretch', 'mob', ['bw'], 't', 'Adduktoren, Hüfte',
    ['Vierfüsslerstand, Knie weit auseinander', 'Innenseiten der Füsse am Boden', 'Hüfte langsam nach hinten schieben', 'Nur bis zum angenehmen Dehngefühl'], '');
  ex('deep_squat', 'Tiefe Hocke halten', 'mob', ['bw'], 't', 'Hüfte, Sprunggelenk, Rücken',
    ['Füsse schulterbreit, Zehen leicht nach aussen', 'So tief wie möglich, Fersen am Boden', 'Brust aufrecht, Ellbogen drücken die Knie auseinander', 'Atmung ruhig'],
    'Ein Gewicht vor der Brust (Kurzhantel) kann das Aufrichten erleichtern.');
  ex('shoulder_car', 'Schulterkreisen (CARs)', 'mob', ['bw'], 'r', 'Schultergelenk',
    ['Aufrecht, Arm gestreckt', 'Grosse, langsame Kreise', 'Rumpf bleibt still', 'Maximal grosser Radius ohne Ausweichen'],
    'Kontrolliertes Kreisen des Schultergelenks im vollen Bewegungsumfang.', { side: true });
  ex('hip_car', 'Hüftkreisen (CARs)', 'mob', ['bw'], 'r', 'Hüftgelenk',
    ['Auf einem Bein stehen, Hand an der Wand', 'Knie anheben, öffnen und nach hinten führen', 'Becken stabil halten', 'Grosse, langsame Kreise'],
    'Kontrolliertes Kreisen des Hüftgelenks im vollen Bewegungsumfang.', { side: true });
  ex('ankle_dis', 'Sprunggelenk Knie-zur-Wand', 'mob', ['bw'], 'r', 'Sprunggelenk, Wade',
    ['Fuss ca. eine Handbreit von der Wand', 'Knie gerade zur Wand schieben', 'Ferse bleibt am Boden', 'Abstand schrittweise vergrössern'],
    'Mobilisation des Sprunggelenks (Dorsalextension).', { side: true });
  ex('ball_tspine', 'BWS-Extension über Ball', 'mob', ['ball'], 't', 'Brustwirbelsäule',
    ['Oberer Rücken liegt auf dem Ball', 'Hände stützen den Kopf', 'Langsam nach hinten über den Ball öffnen', 'Atmung ruhig'],
    'Mobilisation der Brustwirbelsäule in die Streckung.');
  ex('hamstring_str', 'Beinrückseite dehnen', 'mob', ['bw'], 't', 'Beinbeuger',
    ['Rückenlage, ein Bein gestreckt nach oben', 'Mit den Händen oder einem Handtuch heranziehen', 'Becken bleibt am Boden', 'Ruhig atmen'], '', { side: true });
  ex('hip9090', '90/90 Hüftrotation', 'mob', ['bw'], 'r', 'Innen-/Aussenrotation der Hüfte',
    ['Sitz, beide Knie 90° gebeugt, ein Bein vorn, eines seitlich', 'Oberkörper aufrecht', 'Knie nach links und rechts wechseln, Hände nicht abstützen', 'Langsam und kontrolliert'],
    'Wechsel zwischen Innen- und Aussenrotation der Hüfte.');
  ex('open_book', 'Open Book', 'mob', ['bw'], 'r', 'Brustwirbelsäule, Brust',
    ['Seitlage, Knie 90° gebeugt und zusammen', 'Oberen Arm weit nach hinten öffnen', 'Blick folgt der Hand', 'Knie bleiben am Boden'],
    'Mobilisation der Brustwirbelsäule in die Rotation.', { side: true });
  ex('wall_angel', 'Wall Angel', 'mob', ['bw'], 'r', 'Schulterblatt, Brustwirbelsäule',
    ['Rücken, Gesäss und Hinterkopf an der Wand', 'Arme in U-Position an die Wand', 'Langsam nach oben schieben, Kontakt halten', 'Rippen nicht aufspreizen'], '');

  /* ---------- Balance & Kontrolle ---------- */
  ex('sl_stand_disc', 'Einbeinstand auf Scheibe', 'bal', ['disc'], 't', 'Fussmuskeln, Hüfte, Gleichgewicht',
    ['Barfuss auf die Scheibe, Fuss aktiv spreizen', 'Blick auf einen Punkt', 'Hüfte bleibt waagrecht', 'Steigerung: Augen schliessen'],
    'Die instabile Unterlage erhöht den Anspruch an Gleichgewicht und Fussmuskulatur.', { side: true });
  ex('squat_disc', 'Kniebeuge auf Scheibe', 'bal', ['disc'], 'r', 'Beine, Fussstabilität',
    ['Beide Füsse mittig auf der Scheibe', 'Langsam beugen, Scheibe bleibt waagrecht', 'Knie folgen den Zehen', 'Tempo 3 Sekunden runter'], '');
  ex('sl_squat_disc', 'Einbeinige Mini-Kniebeuge auf Scheibe', 'bal', ['disc'], 'r', 'Beine, Hüfte, Fusskontrolle',
    ['Standbein auf der Scheibe', 'Knie nur 30–40° beugen', 'Knie bleibt über dem Fuss', 'Freies Bein vorn halten'], '', { side: true });
  ex('sl_rdl_disc', 'Einbeiniges Reichen auf Scheibe', 'bal', ['disc'], 'r', 'Beinrückseite, Rumpf, Gleichgewicht',
    ['Auf einem Bein auf der Scheibe', 'Mit einer Hand zum Boden reichen', 'Freies Bein gestreckt nach hinten', 'Hüfte bleibt gerade'], '', { side: true });
  ex('plank_disc', 'Plank, Hände auf Scheibe', 'bal', ['disc'], 't', 'Rumpf, Schultern',
    ['Hände oder Unterarme auf der Scheibe', 'Körper bleibt gerade', 'Scheibe nicht kippen lassen', 'Gleichmässig atmen'], '');
  ex('sl_head_turn', 'Einbeinstand mit Kopfdrehen', 'bal', ['disc'], 't', 'Gleichgewicht, Nacken, Koordination',
    ['Einbeinstand auf der Scheibe', 'Kopf langsam nach links und rechts drehen', 'Danach nach oben und unten', 'Steigerung: Augen schliessen'],
    'Die zusätzliche Kopfbewegung erschwert das Gleichgewicht.', { side: true });
  ex('ybal', 'Y-Balance Reichen', 'bal', ['bw'], 'r', 'Beine, Hüfte, Rumpf',
    ['Standbein leicht gebeugt', 'Freies Bein tippt nach vorn, seitlich und hinten', 'Nicht ablegen, kontrolliert zurückkehren', 'Reichweite schrittweise steigern'],
    'Reichen in drei Richtungen auf einem Bein (Prinzip des Y-Balance-Tests).', { side: true });
  ex('tandem', 'Seiltänzer-Gang', 'bal', ['bw'], 'r', 'Gleichgewicht, Fussmuskeln',
    ['Ferse direkt vor die Zehen setzen', 'Arme seitlich', 'Blick geradeaus', 'Steigerung: rückwärts'], '');
  ex('ball_sit_march', 'Ball-Sitzen mit Marschieren', 'bal', ['ball'], 'r', 'Rumpf, Hüftbeuger, Gleichgewicht',
    ['Aufrecht auf dem Ball', 'Abwechselnd ein Knie anheben', 'Rumpf bleibt ruhig', 'Steigerung: Arme heben'], '');
  ex('sl_circle', 'Einbeinstand mit Hantel um den Körper', 'bal', ['db', 'disc'], 'r', 'Gleichgewicht, Rumpf',
    ['Leichte Hantel in beiden Händen', 'Auf einem Bein stehen (optional auf Scheibe)', 'Hantel um den Körper führen', 'Richtung wechseln'], '', { side: true });

  /* ---------- Kondition ---------- */
  ex('thruster', 'Kurzhantel Thruster', 'cond', ['db'], 'wr', 'Ganzkörper, Beine, Schultern',
    ['Hanteln auf den Schultern', 'Tiefe Kniebeuge', 'Aus der Beinkraft nach oben drücken', 'Atmen: aufwärts aus'], '');
  ex('db_swing', 'Kurzhantel Swing', 'cond', ['db'], 'wr', 'Gesäss, Beinrückseite, Rücken',
    ['Eine Hantel mit beiden Händen', 'Hüfte nach hinten, Rücken gerade', 'Hüfte explosiv strecken, Arme schwingen mit', 'Hantel bis Brusthöhe'],
    'Explosive Hüftstreckung; der Rücken bleibt neutral.');
  ex('db_snatch', 'Einarm Kurzhantel Reissen', 'cond', ['db'], 'wr', 'Ganzkörper, Schulter',
    ['Hantel zwischen den Füssen', 'Hüfte explosiv strecken', 'Hantel in einer Bewegung über den Kopf führen', 'Oben stabil, kontrolliert absenken'],
    'Anspruchsvoll: erst mit leichter Hantel üben. Auf freien Raum über dem Kopf achten.', { side: true });
  ex('burpee', 'Burpee', 'cond', ['bw'], 'r', 'Ganzkörper',
    ['Hocke, Hände auf den Boden', 'Füsse nach hinten springen', 'Brust zum Boden (oder Liegestütz)', 'Aufspringen'], '');
  ex('mclimber', 'Mountain Climbers', 'cond', ['bw'], 't', 'Rumpf, Schultern, Hüftbeuger',
    ['Hohe Plank', 'Knie abwechselnd zur Brust ziehen', 'Hüfte bleibt tief', 'Schnelles, kontrolliertes Tempo'], '');
  ex('skater', 'Skater Sprünge', 'cond', ['bw'], 't', 'Beine, Gesäss, Gleichgewicht',
    ['Seitlich von Bein zu Bein springen', 'Weich landen, Knie gebeugt', 'Standbein stabil', 'Rumpf leicht nach vorn'],
    'Seitliche Sprünge fordern die Landekontrolle.');
  ex('highknees', 'Kniehebelauf', 'cond', ['bw'], 't', 'Beine, Hüftbeuger, Kondition',
    ['Auf dem Ballen laufen', 'Knie auf Hüfthöhe', 'Arme laufen mit', 'Aufrecht bleiben'], '');
  ex('jumprope', 'Seilspringen (ohne Seil)', 'cond', ['bw'], 't', 'Waden, Kondition, Koordination',
    ['Kleine Sprünge über die Fussballen', 'Handgelenke drehen die imaginäre Schnur', 'Ellbogen am Körper', 'Leise landen'], '');
  ex('jacks', 'Hampelmann', 'cond', ['bw'], 't', 'Ganzkörper, Kondition', ['Rhythmisch springen', 'Arme gestreckt über den Kopf', 'Weich landen'], '');
  ex('squat_jump', 'Squat Jump', 'cond', ['bw'], 'r', 'Beine, Explosivkraft',
    ['Kniebeuge, dann explosiv springen', 'Mit gebeugten Knien weich landen', 'Rumpf aufrecht', 'Direkt in die nächste Wiederholung'], '');
  ex('shuffle', 'Seitliche Shuffles', 'cond', ['bw'], 't', 'Beine, Agilität',
    ['Tiefe Position, Hüfte unten', 'Schnell zur Seite „schlurfen", Füsse berühren sich nicht', 'Brust aufrecht', 'Blick nach vorn'],
    'Seitliche Schritte in tiefer Position.');
  ex('sprint_spot', 'Sprint am Ort', 'cond', ['bw'], 't', 'Beine, Kondition',
    ['Aus leichter Vorlage maximal schnell laufen', 'Arme aktiv', 'Hohe Frequenz', 'Kurz und maximal'], '');
  ex('bear_crawl', 'Bärengang', 'cond', ['bw'], 't', 'Rumpf, Schultern, Beine',
    ['Knie knapp über dem Boden', 'Gegenarm und Gegenbein bewegen', 'Rücken flach', 'Langsam und kontrolliert'], '');
  ex('lat_bound', 'Seitliche Bounds', 'cond', ['bw'], 'r', 'Beine, Explosivkraft',
    ['Von einem Bein zum anderen springen', '2 Sekunden auf dem Landebein stabilisieren', 'Knie bleibt stabil', 'Steigerung: weiter springen'], '');

  const EXMAP = {};
  EX.forEach(e => (EXMAP[e.id] = e));

  /* ---------- Einheiten ---------- */
  // Hilfsfunktion: it(übung, Sätze[3 Phasen], Wdh/Sek[3 Phasen], Pause)
  const it = (e, s, r, rest) => ({ ex: e, s, r, rest: rest === undefined ? 45 : rest });

  const WARM = { n: 'Aufwärmen', items: [it('catcow', 1, 8, 0), it('worlds_greatest', 1, 4, 0), it('deep_squat', 1, 30, 0), it('shoulder_car', 1, 5, 0)] };

  const SESS = {
    kraftA: {
      id: 'kraftA', name: 'Kraft A', sub: 'Ganzkörper · Kniebeuge, Drücken, Ziehen', kind: 'strength', tags: ['Kraft', 'Rumpf'],
      blocks: [
        WARM,
        {
          n: 'Hauptteil', items: [
            it('bb_squat', [3, 4, 4], [10, 8, 5], [75, 90, 120]),
            it('db_press_ball', [3, 3, 4], [12, 10, 8], 75),
            it('bb_row', [3, 3, 4], [12, 10, 8], 75),
            it('sl_rdl', [2, 3, 3], [10, 8, 8], 60),
            it('bb_ohp', [2, 3, 3], [12, 10, 8], 60)
          ]
        },
        {
          n: 'Rumpf-Finisher', items: [
            it('plank', [2, 3, 3], [30, 40, 50], 30),
            it('deadbug', [2, 3, 3], [10, 10, 12], 30)
          ]
        },
        { n: 'Cool-down', items: [it('hipflexor', 1, 40, 0), it('hamstring_str', 1, 40, 0)] }
      ]
    },
    kraftB: {
      id: 'kraftB', name: 'Kraft B', sub: 'Ganzkörper · Hüfte, Einbein, Rotation', kind: 'strength', tags: ['Kraft', 'Rumpf'],
      blocks: [
        { n: 'Aufwärmen', items: [it('catcow', 1, 8, 0), it('hip_car', 1, 5, 0), it('ankle_dis', 1, 8, 0), it('wall_angel', 1, 10, 0)] },
        {
          n: 'Hauptteil', items: [
            it('bb_rdl', [3, 4, 4], [10, 8, 6], [75, 90, 120]),
            it('bulgarian', [2, 3, 3], [10, 8, 8], 75),
            it('pushup_ball', [3, 3, 4], [8, 10, 12], 60),
            it('ball_row', [3, 3, 4], [12, 10, 8], 60),
            it('hip_thrust', [3, 3, 4], [12, 10, 8], 75)
          ]
        },
        {
          n: 'Rumpf-Finisher', items: [
            it('side_plank', [2, 3, 3], [25, 35, 45], 20),
            it('ball_rollout', [2, 3, 3], [8, 10, 12], 30)
          ]
        },
        { n: 'Cool-down', items: [it('frog', 1, 45, 0), it('thread', 1, 6, 0)] }
      ]
    },
    control: {
      id: 'control', name: 'Mobilität & Körperkontrolle', sub: 'Gelenkbeweglichkeit · Balancierscheibe', kind: 'mobility', tags: ['Mobilität', 'Balance'],
      blocks: [
        {
          n: 'Mobilität', items: [
            it('catcow', 1, 8, 0), it('worlds_greatest', 2, 5, 0), it('hip9090', 2, 8, 0), it('open_book', 2, 8, 0),
            it('ankle_dis', 2, 10, 0), it('shoulder_car', 1, 5, 0), it('frog', 2, 40, 15)
          ]
        },
        {
          n: 'Balance & Kontrolle', items: [
            it('sl_stand_disc', [2, 3, 3], [30, 40, 45], 20),
            it('sl_squat_disc', [2, 3, 3], [8, 10, 12], 30),
            it('sl_rdl_disc', [2, 3, 3], [8, 8, 10], 30),
            it('ybal', [2, 2, 3], [6, 8, 8], 30),
            it('plank_disc', [2, 3, 3], [20, 30, 40], 30),
            it('pushup_disc', [2, 2, 3], [6, 8, 10], 45),
            it('sl_head_turn', [1, 2, 2], [30, 30, 40], 20)
          ]
        },
        { n: 'Ausklang', items: [it('ball_tspine', 1, 45, 0), it('hamstring_str', 1, 40, 0)] }
      ]
    },
    cond: {
      id: 'cond', name: 'Kondition Intervall', sub: 'Herz-Kreislauf · Zuhause mit Kurzhanteln', kind: 'cond', tags: ['Kondition'],
      blocks: [
        { n: 'Aufwärmen', items: [it('jacks', 1, 45, 0), it('jumprope', 1, 60, 0), it('catcow', 1, 6, 0)] },
        { n: 'Zirkel 1 · Ganzkörper', circuit: true, rounds: [3, 4, 4], work: [35, 40, 40], rest: 20, roundRest: 60, items: ['db_swing', 'skater', 'mclimber', 'thruster'] },
        { n: 'Zirkel 2 · Beine & Sprünge', circuit: true, rounds: [3, 3, 4], work: [35, 40, 40], rest: 20, roundRest: 60, items: ['squat_jump', 'shuffle', 'highknees', 'burpee'] },
        { n: 'Finisher · Sprint-Intervalle', minPhase: 1, circuit: true, rounds: [6, 8, 10], work: 20, rest: 10, roundRest: 10, items: ['sprint_spot'] },
        { n: 'Cool-down', items: [it('hipflexor', 1, 30, 0), it('hamstring_str', 1, 30, 0), it('deep_squat', 1, 30, 0)] }
      ]
    },
    core: {
      id: 'core', name: 'Rumpf & Rotation', sub: 'Stabilität · Rotationsübungen (Golf & Fussball)', kind: 'core', tags: ['Rumpf', 'Rotation'],
      blocks: [
        { n: 'Aufwärmen', items: [it('catcow', 1, 8, 0), it('open_book', 1, 6, 0), it('birddog', 1, 6, 0)] },
        {
          n: 'Anti-Extension', items: [
            it('ball_stir', [2, 3, 3], [30, 40, 45], 30),
            it('ball_rollout', [2, 3, 3], [8, 10, 12], 30),
            it('hollow', [2, 3, 3], [20, 25, 30], 30)
          ]
        },
        {
          n: 'Anti-Rotation & Seite', items: [
            it('plank_tap', [2, 3, 3], [12, 16, 20], 30),
            it('side_plank', [2, 3, 3], [25, 35, 45], 20),
            it('suitcase', [2, 2, 3], [30, 35, 40], 30)
          ]
        },
        {
          n: 'Rotationskraft', items: [
            it('landmine_rot', [2, 3, 3], [8, 10, 10], 45),
            it('woodchop', [2, 3, 3], [10, 10, 12], 45),
            it('stick_rot', [2, 2, 3], [10, 12, 12], 30),
            it('ball_seated_rot', 1, 10, 0)
          ]
        },
        { n: 'Cool-down', items: [it('thread', 1, 6, 0), it('hip9090', 1, 8, 0)] }
      ]
    },
    flow: {
      id: 'flow', name: 'Mobility Flow', sub: 'Aktive Erholung · ganzer Körper', kind: 'flow', tags: ['Mobilität', 'Erholung'],
      blocks: [
        {
          n: 'Flow', items: [
            it('catcow', 2, 8, 0), it('worlds_greatest', 2, 5, 0), it('hip9090', 2, 8, 0), it('thread', 2, 6, 0),
            it('hipflexor', 1, 45, 0), it('hamstring_str', 1, 45, 0), it('frog', 1, 60, 0), it('deep_squat', 2, 40, 10),
            it('ball_tspine', 1, 60, 0), it('wall_angel', 1, 10, 0)
          ]
        }
      ]
    }
  };

  const QUICK = {
    q_morning: {
      id: 'q_morning', name: 'Morgen-Mobility', sub: '10 Min · Gelenke wecken', kind: 'flow', tags: ['Mobilität'],
      blocks: [{ n: 'Flow', items: [it('catcow', 1, 8, 0), it('worlds_greatest', 1, 4, 0), it('hip9090', 1, 8, 0), it('thread', 1, 6, 0), it('shoulder_car', 1, 5, 0), it('deep_squat', 1, 40, 0)] }]
    },
    q_golf: {
      id: 'q_golf', name: 'Golf Warm-up', sub: '8 Min · vor der Runde', kind: 'core', tags: ['Rotation'],
      blocks: [{ n: 'Aktivierung', items: [it('catcow', 1, 6, 0), it('hip_car', 1, 5, 0), it('open_book', 1, 6, 0), it('stick_rot', 1, 10, 0), it('lat_lunge', 1, 6, 0), it('sl_stand_disc', 1, 20, 0)] }]
    },
    q_fussball: {
      id: 'q_fussball', name: 'Fussball Aktivierung', sub: '10 Min · Sprünge & Seitwärtsbewegung', kind: 'cond', tags: ['Kondition'],
      blocks: [{ n: 'Aktivierung', items: [it('jacks', 1, 40, 0), it('hip_car', 1, 5, 0), it('lat_lunge', 1, 6, 0), it('shuffle', 2, 25, 15), it('skater', 2, 25, 15), it('ybal', 1, 5, 0)] }]
    },
    q_core: {
      id: 'q_core', name: 'Rumpf Express', sub: '12 Min · Kompakt', kind: 'core', tags: ['Rumpf'],
      blocks: [{ n: 'Circuit', items: [it('plank', 2, 40, 20), it('deadbug', 2, 12, 20), it('side_plank', 2, 30, 15), it('birddog', 2, 8, 20), it('hollow', 2, 25, 20)] }]
    },
    q_reset: {
      id: 'q_reset', name: 'Rücken & Schulter Reset', sub: '8 Min · nach dem Sitzen', kind: 'flow', tags: ['Mobilität'],
      blocks: [{ n: 'Reset', items: [it('wall_angel', 2, 10, 15), it('thread', 1, 6, 0), it('ytw', 2, 8, 20), it('catcow', 1, 8, 0), it('ball_tspine', 1, 45, 0)] }]
    },
    q_balance: {
      id: 'q_balance', name: 'Balance Snack', sub: '10 Min · Körperkontrolle', kind: 'mobility', tags: ['Balance'],
      blocks: [{ n: 'Balance', items: [it('sl_stand_disc', 2, 30, 10), it('sl_head_turn', 1, 30, 10), it('sl_squat_disc', 2, 8, 15), it('ybal', 2, 6, 15), it('tandem', 1, 12, 0)] }]
    }
  };

  // Wochenplan (Mo–So)
  const WEEK = ['kraftA', 'control', 'cond', 'core', 'kraftB', 'flow', null];

  const PHASES = [
    { n: 'Fundament', w: 'Woche 1–4', d: 'Technik und Bewegungsqualität. Mehr Wiederholungen, kontrolliertes Tempo, Mobilität verbessern.' },
    { n: 'Aufbau', w: 'Woche 5–8', d: 'Mehr Last, mehr Einbein-Arbeit, längere Intervalle und Sprint-Finisher für die Kondition.' },
    { n: 'Performance', w: 'Woche 9–12', d: 'Schwerere Lasten bei weniger Wiederholungen und mehr Rotationsarbeit. Die Phasen sind eine Planungsentscheidung der App.' }
  ];

  const TESTS = [
    { id: 'stand_l', name: 'Einbeinstand links', unit: 's', better: 'high', hint: 'Auf der Scheibe, Augen offen, Maximalzeit (bis 60 s).' },
    { id: 'stand_r', name: 'Einbeinstand rechts', unit: 's', better: 'high', hint: 'Wie links.' },
    { id: 'stand_closed_l', name: 'Einbeinstand links, Augen zu', unit: 's', better: 'high', hint: 'Ohne Scheibe auf festem Boden, Maximalzeit.' },
    { id: 'stand_closed_r', name: 'Einbeinstand rechts, Augen zu', unit: 's', better: 'high', hint: 'Wie links.' },
    { id: 'reach', name: 'Fingerspitzen zum Boden', unit: 'cm', better: 'low', hint: 'Im Stand mit gestreckten Knien nach unten beugen. Abstand der Fingerspitzen zum Boden. 0 = Boden berührt, negativ = Handflächen am Boden.' },
    { id: 'squat', name: 'Tiefe Hocke', unit: '/5', better: 'high', hint: 'Selbsteinschätzung: 1 = schwer, 5 = ganz tief, Fersen am Boden, Brust aufrecht.', rating: true },
    { id: 'rot_l', name: 'Rumpfrotation links', unit: '/5', better: 'high', hint: 'Im Sitzen auf dem Ball, Arme verschränkt: 1 = kaum, 5 = sehr weit (>90°).', rating: true },
    { id: 'rot_r', name: 'Rumpfrotation rechts', unit: '/5', better: 'high', hint: 'Wie links.', rating: true },
    { id: 'plank', name: 'Plank', unit: 's', better: 'high', hint: 'Maximalzeit mit sauberer Haltung.' },
    { id: 'side_l', name: 'Seitstütz links', unit: 's', better: 'high', hint: 'Maximalzeit mit sauberer Haltung.' },
    { id: 'side_r', name: 'Seitstütz rechts', unit: 's', better: 'high', hint: 'Wie links.' }
  ];

  // Neueste Version zuerst
  const VERSION = '2.4.0';
  const CHANGELOG = [
    { v: '2.4.0', date: '2026-11-01', title: 'Digitaler Coach, anpassbare Pläne', items: ['Plan-Assistent schlägt einen Wochenplan vor (Trainingstage, Schwerpunkt)', 'Einheiten anpassen: Übungen ersetzen, hinzufügen, löschen; Sätze, Wiederholungen und Pausen ändern; Zurücksetzen auf den Vorschlag', 'Wochenplan frei anpassen', 'Coach mit Belastungssteuerung (Akut:Chronisch-Verhältnis, Monotonie), Abdeckung der Muskelgruppen und Progressions-Hinweisen', 'Aktivitäten wie Fussball oder Golf eintragen; sie fliessen in die Belastung ein', 'Alle Hinweise nennen ihre wissenschaftliche Quelle; Quellenliste im Coach', 'Übungstexte überarbeitet: nur noch Beschreibungen, keine unbelegten Wirkversprechen'] },
    { v: '2.3.0', date: '2026-11-01', title: 'Automatische Updates, Apple Health & Watch', items: ['Die App aktualisiert sich selbständig – kein Löschen und Neuinstallieren mehr nötig', 'Während eines Trainings wird nie neu geladen; das Update folgt danach', 'Apple Health: Training nach dem Speichern per Kurzbefehl eintragen (Anleitung im Profil)', 'Apple Watch: Anleitung für Kurzbefehl und Watch-Workout im Profil'] },
    { v: '2.2.0', date: '2026-11-01', title: 'Neuer Name und Icon', items: ['Die App heisst jetzt Winter-Fit', 'Neues Icon: Schneekristall mit Langhantel', 'Optimiert für iPhone: Icon ohne Ränder auf dem Home-Bildschirm und kein Zoomen durch Doppeltippen'] },
    { v: '2.1.0', date: '2026-11-01', title: 'Update-Historie', items: ['Neue Update-Historie im Profil', 'Nach einem Update erscheint einmalig „Neu in dieser Version“'] },
    { v: '2.0.0', date: '2026-11-01', title: 'Winter-Fit – komplett neu', items: ['12-Wochen-Winterprogramm in 3 Phasen mit Entlastungswochen', '86 Übungen für Gymnastikball, Lang- und Kurzhanteln und Balancierscheibe', 'Geführter Workout-Modus mit Timern, Pausen und Gewichts-Protokoll', 'Bestwerte, Wochenziel, Serie, Aktivitätskalender und Verlauf pro Übung', 'Körper-Check für Balance, Beweglichkeit und Rumpfkraft', 'Eigene Workouts, Backup-Export (JSON/CSV) und Offline-Betrieb', 'Hell- und Dunkelmodus'] },
    { v: '1.0.0', date: '2026-03-01', title: 'Trainingsplan März', items: ['Tagesplan mit Checkliste, Video-Links und Timer'] }
  ];

  // Quellen für alle Coach-Hinweise
  const SOURCES = {
    who: { short: 'WHO 2020', full: 'World Health Organization (2020): WHO guidelines on physical activity and sedentary behaviour. Genf. – Erwachsene: 150–300 Min moderate oder 75–150 Min intensive Ausdaueraktivität pro Woche sowie muskelkräftigende Aktivität aller grossen Muskelgruppen an mindestens 2 Tagen pro Woche.' },
    acsm: { short: 'ACSM 2009', full: 'American College of Sports Medicine (2009): Progression models in resistance training for healthy adults. Medicine & Science in Sports & Exercise 41(3):687–708. – u. a. Pausen von 48–72 h für dieselbe Muskelgruppe; Laststeigerung um 2–10 %, wenn die geplante Wiederholungszahl in zwei aufeinanderfolgenden Einheiten um 1–2 übertroffen wird.' },
    fos98: { short: 'Foster 1998', full: 'Foster C. (1998): Monitoring training in athletes with reference to overtraining syndrome. Medicine & Science in Sports & Exercise 30(7):1164–1168. – Monotonie und Belastungsindex („strain“) im Zusammenhang mit Krankheit und Übertraining bei Athleten.' },
    fos01: { short: 'Foster 2001', full: 'Foster C. et al. (2001): A new approach to monitoring exercise training. Journal of Strength and Conditioning Research 15(1):109–115. – Methode „Session-RPE“: Belastung = Anstrengung (0–10) × Dauer in Minuten.' },
    gab: { short: 'Gabbett 2016', full: 'Gabbett T. J. (2016): The training–injury prevention paradox: should athletes be training smarter and harder? British Journal of Sports Medicine 50(5):273–280. – Akut:Chronisch-Verhältnis: 0,8–1,3 als günstiger Bereich, ab etwa 1,5 erhöhtes Verletzungsrisiko bei Teamsportlern.' },
    imp: { short: 'Impellizzeri 2020', full: 'Impellizzeri F. M. et al. (2020): Acute:chronic workload ratio: conceptual issues and fundamental pitfalls. International Journal of Sports Physiology and Performance 15(6):907–913. – Kritik am Akut:Chronisch-Modell; die Werte sind Orientierung, keine verlässliche Vorhersage.' }
  };

  W.DATA = { CAT, EQ, EX, EXMAP, SESS, QUICK, WEEK, PHASES, TESTS, VERSION, CHANGELOG, SOURCES };
})(window);
