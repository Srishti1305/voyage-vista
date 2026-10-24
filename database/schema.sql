CREATE DATABASE IF NOT EXISTS voyage_vista; USE voyage_vista;
CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100) NOT NULL,email VARCHAR(150) UNIQUE NOT NULL,password_hash VARCHAR(255) NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS destinations(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(120) NOT NULL,city VARCHAR(100) NOT NULL,state VARCHAR(100) NOT NULL,description TEXT,category VARCHAR(60),best_time VARCHAR(100),avg_budget VARCHAR(100),image_url TEXT,featured BOOLEAN DEFAULT FALSE);
CREATE TABLE IF NOT EXISTS attractions(id INT AUTO_INCREMENT PRIMARY KEY,destination_id INT NOT NULL,name VARCHAR(150),description TEXT,FOREIGN KEY(destination_id) REFERENCES destinations(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS favorites(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NOT NULL,destination_id INT NOT NULL,UNIQUE(user_id,destination_id),FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,FOREIGN KEY(destination_id) REFERENCES destinations(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS trips(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NOT NULL,destination_id INT NOT NULL,start_date DATE,days INT,budget VARCHAR(50),interests VARCHAR(255),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,FOREIGN KEY(destination_id) REFERENCES destinations(id) ON DELETE CASCADE);
INSERT INTO destinations(name,city,state,description,category,best_time,avg_budget,image_url,featured) VALUES
('Jaipur','Jaipur','Rajasthan','The Pink City blends royal forts, colorful bazaars and Rajasthani culture.','Heritage','October to March','$180 - $350','https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',1),
('Goa','Panaji','Goa','Beaches, Portuguese heritage, cafés and coastal adventures.','Beach','November to February','$220 - $450','https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',1),
('Varanasi','Varanasi','Uttar Pradesh','Ancient ghats, spiritual traditions and unforgettable Ganga evenings.','Spiritual','October to March','$120 - $280','https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',1),
('Manali','Manali','Himachal Pradesh','Mountain views, adventure activities and scenic Himalayan escapes.','Mountains','March to June','$200 - $400','https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',1),
('Agra','Agra','Uttar Pradesh','Home of the Taj Mahal and a rich Mughal architectural legacy.','Heritage','October to March','$100 - $240','https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',0),
('Udaipur','Udaipur','Rajasthan','Romantic lakes, palaces and historic old-city streets.','Heritage','September to March','$180 - $380','https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1200&q=80',0);
INSERT INTO attractions(destination_id,name,description) VALUES (1,'Amber Fort','Hilltop fort known for courtyards and grand architecture.'),(1,'Hawa Mahal','Iconic pink sandstone palace facade.'),(2,'Baga Beach','Popular beach for sunsets and water activities.'),(3,'Dashashwamedh Ghat','Major Ganga ghat known for the evening aarti.'),(4,'Solang Valley','Adventure and mountain recreation area.'),(5,'Taj Mahal','UNESCO World Heritage marble mausoleum.'),(6,'City Palace','Large palace complex overlooking Lake Pichola.');
CREATE TABLE IF NOT EXISTS trip_photos(
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  destination_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);
