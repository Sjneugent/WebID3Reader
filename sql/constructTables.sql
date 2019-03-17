/*Create the initial table in the media schema*/
use media;

CREATE TABLE fileInfo(ID int NOT NULL, FilePath VARCHAR(255), FileName VARCHAR(255), Hash CHAR(32), Size INT, PRIMARY KEY (ID));
