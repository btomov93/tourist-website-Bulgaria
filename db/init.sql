DROP TABLE IF EXISTS places;

CREATE TABLE places (
  id SERIAL PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_bg TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_bg TEXT NOT NULL,
  details_en TEXT,
  details_bg TEXT,
  image_url TEXT NOT NULL,
  map_url TEXT,
  gallery_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  town TEXT NOT NULL,
  category TEXT NOT NULL
);

INSERT INTO places (title_en, title_bg, description_en, description_bg, image_url, map_url, town, category) VALUES
  ('Sofia', 'София', 'Capital city with history, culture, and modern life.', 'Столичен град с история, култура и модерен живот.', 'https://source.unsplash.com/1200x800/?sofia,bulgaria,landmark', 'https://maps.google.com/?q=Sofia+Bulgaria', 'Sofia', 'city'),
  ('Plovdiv', 'Пловдив', 'Ancient city famous for Old Town and Roman heritage.', 'Древен град, известен със Стария град и римското наследство.', 'https://source.unsplash.com/1200x800/?plovdiv,old-town,bulgaria', 'https://maps.google.com/?q=Plovdiv+Bulgaria', 'Plovdiv', 'city'),
  ('Varna', 'Варна', 'Major Black Sea city with beaches and sea gardens.', 'Голям черноморски град с плажове и морска градина.', 'https://source.unsplash.com/1200x800/?varna,black-sea,bulgaria', 'https://maps.google.com/?q=Varna+Bulgaria', 'Varna', 'sea'),
  ('Burgas', 'Бургас', 'Friendly sea city with parks, beaches, and festivals.', 'Приветлив морски град с паркове, плажове и фестивали.', 'https://source.unsplash.com/1200x800/?burgas,bulgaria,coast', 'https://maps.google.com/?q=Burgas+Bulgaria', 'Burgas', 'sea'),
  ('Rila Monastery', 'Рилски манастир', 'UNESCO monastery in the Rila Mountains.', 'Манастир от ЮНЕСКО в Рила планина.', 'https://source.unsplash.com/1200x800/?rila,monastery,bulgaria', 'https://maps.google.com/?q=Rila+Monastery', 'Rila', 'historical'),
  ('Bansko', 'Банско', 'Popular mountain resort for skiing and summer hikes.', 'Популярен планински курорт за ски и летни преходи.', 'https://source.unsplash.com/1200x800/?bansko,ski,bulgaria', 'https://maps.google.com/?q=Bansko+Bulgaria', 'Bansko', 'mountain'),
  ('Seven Rila Lakes', 'Седемте рилски езера', 'Iconic alpine lakes and panoramic trails.', 'Емблематични високопланински езера и панорамни маршрути.', 'https://source.unsplash.com/1200x800/?rila,lakes,bulgaria', 'https://maps.google.com/?q=Seven+Rila+Lakes', 'Rila', 'mountain'),
  ('Belogradchik Rocks', 'Белоградчишките скали', 'Spectacular rock formations and fortress views.', 'Впечатляващи скални образувания и гледки към крепостта.', 'https://source.unsplash.com/1200x800/?belogradchik,rocks,bulgaria', 'https://maps.google.com/?q=Belogradchik+Rocks', 'Belogradchik', 'historical'),
  ('Veliko Tarnovo', 'Велико Търново', 'Historic capital with Tsarevets fortress.', 'Стара столица с крепостта Царевец.', 'https://source.unsplash.com/1200x800/?veliko,tarnovo,bulgaria', 'https://maps.google.com/?q=Veliko+Tarnovo+Bulgaria', 'Veliko Tarnovo', 'historical'),
  ('Nesebar', 'Несебър', 'Seaside old town with medieval churches.', 'Стар морски град със средновековни църкви.', 'https://source.unsplash.com/1200x800/?nesebar,bulgaria,old-town', 'https://maps.google.com/?q=Nesebar+Bulgaria', 'Nesebar', 'historical'),
  ('Kaliakra', 'Калиакра', 'Cliff peninsula with dramatic sea views.', 'Скален нос с драматични гледки към морето.', 'https://source.unsplash.com/1200x800/?kaliakra,cliffs,bulgaria', 'https://maps.google.com/?q=Cape+Kaliakra+Bulgaria', 'Kavarna', 'sea'),
  ('Ruse', 'Русе', 'Danube city with elegant architecture.', 'Дунавски град с елегантна архитектура.', 'https://source.unsplash.com/1200x800/?ruse,bulgaria,danube', 'https://maps.google.com/?q=Ruse+Bulgaria', 'Ruse', 'city'),
  ('Alexander Nevsky Cathedral', 'Храм-паметник Александър Невски', 'One of Bulgaria''s most iconic cathedrals in Sofia.', 'Един от най-емблематичните храмове в София.', 'https://source.unsplash.com/1200x800/?alexander-nevsky,cathedral,sofia', 'https://maps.google.com/?q=Alexander+Nevsky+Cathedral+Sofia', 'Sofia', 'historical'),
  ('Tsarevets Fortress', 'Крепост Царевец', 'Medieval fortress above Veliko Tarnovo.', 'Средновековна крепост над Велико Търново.', 'https://source.unsplash.com/1200x800/?tsarevets,fortress,bulgaria', 'https://maps.google.com/?q=Tsarevets+Fortress', 'Veliko Tarnovo', 'historical'),
  ('Devil''s Throat Cave', 'Пещера Дяволското гърло', 'Famous cave in the Rhodope Mountains.', 'Известна пещера в Родопите.', 'https://source.unsplash.com/1200x800/?devils-throat,cave,bulgaria', 'https://maps.google.com/?q=Devils+Throat+Cave+Bulgaria', 'Smolyan', 'mountain'),
  ('Koprivshtitsa', 'Копривщица', 'Revival town known for colorful historic houses.', 'Възрожденски град с цветни исторически къщи.', 'https://source.unsplash.com/1200x800/?koprivshtitsa,bulgaria,architecture', 'https://maps.google.com/?q=Koprivshtitsa+Bulgaria', 'Koprivshtitsa', 'historical'),
  ('Melnik', 'Мелник', 'Smallest Bulgarian town, famous for wine and sandstone hills.', 'Най-малкият български град, известен с вино и пясъчни пирамиди.', 'https://source.unsplash.com/1200x800/?melnik,bulgaria,wine', 'https://maps.google.com/?q=Melnik+Bulgaria', 'Melnik', 'historical'),
  ('Etar Open-Air Museum', 'Етър музей на открито', 'Traditional crafts museum near Gabrovo.', 'Музей на традиционните занаяти край Габрово.', 'https://source.unsplash.com/1200x800/?etar,gabrovo,bulgaria,museum', 'https://maps.google.com/?q=Etar+Open-Air+Museum', 'Gabrovo', 'historical'),
  ('Pirin National Park', 'Национален парк Пирин', 'UNESCO-listed mountain nature and alpine lakes.', 'Планинска природа и езера под закрила на ЮНЕСКО.', 'https://source.unsplash.com/1200x800/?pirin,mountains,bulgaria', 'https://maps.google.com/?q=Pirin+National+Park', 'Bansko', 'mountain'),
  ('Sozopol', 'Созопол', 'Historic Black Sea town with old streets and beaches.', 'Исторически черноморски град със стари улички и плажове.', 'https://source.unsplash.com/1200x800/?sozopol,bulgaria,sea', 'https://maps.google.com/?q=Sozopol+Bulgaria', 'Sozopol', 'sea'),
  ('Vitosha Mountain', 'Витоша планина', 'Mountain escape right next to Sofia.', 'Планинско бягство до самата София.', 'https://source.unsplash.com/1200x800/?vitosha,mountain,sofia', 'https://maps.google.com/?q=Vitosha+Mountain', 'Sofia', 'mountain'),
  ('Boyana Church', 'Боянска църква', 'UNESCO medieval church with remarkable frescoes.', 'Средновековна църква от ЮНЕСКО с впечатляващи стенописи.', 'https://source.unsplash.com/1200x800/?boyana,church,sofia', 'https://maps.google.com/?q=Boyana+Church', 'Sofia', 'historical');

