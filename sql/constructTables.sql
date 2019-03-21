/*Create the initial table in the media schema*/
use media;

CREATE TABLE fileInfo(ID int NOT NULL, FilePath VARCHAR(255), FileName VARCHAR(255), Hash CHAR(32) UNIQUE, Size INT, PRIMARY KEY (ID));
CREATE TABLE fileMetadata(ID int NOT NULL auto_increment, Format VARCHAR(255), FileSize INT, Duration VARCHAR(255), OverallBitRate VARCHAR(255), OverallBitRate VARCHAR(255), Album VARCHAR(255), AlbumPerformer VARCHAR(255), PartPosition INT, PartTotal INT, TrackName VARCHAR(255),
                          TrackNamePosition INT, Performer VARCHAR(255), Composer VARCHAR(255), Genre VARCHAR(255), RecordedDate INT, WritingLibrary VARCHAR(255), Cover BOOL, CoverMime VARCHAR(48), PRIMARY KEY(ID));
CREATE TABLE fileAudiodata(ID INT NOT NULL auto_increment, Channels INT, SamplingRate Int, CompressionMode VARCHAR(64), StreamSize INT. PRIMARY KEY(ID));