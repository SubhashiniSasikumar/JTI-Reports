USE [mm]
GO

CREATE TABLE [MEC_MM_SEND_EMAIL_LINK]
(
  ID              NVARCHAR(255) PRIMARY KEY,
  ASSET_ID        VARBINARY(MAX),
  START_DATE      datetime,
  END_DATE        datetime,
  DAYS_AVAILABLE  INT DEFAULT 2,
  MAX_HITS        INT DEFAULT 2,
  USER_ID         NVARCHAR(255),
  EMAIL_ADDR      NVARCHAR(255),
  CURR_HITS       INT DEFAULT 0
);

INSERT INTO [TRANSFORMERS](TRANSFORMER_ID,IMPLEMENTATION_CLASS,IS_IMPORT,IS_EXPORT,IS_EXPORT_JOB,ID,NAME,DESCR,TRANSFORMER_EXECUTABLE,WRAPPER_ID,USER_ID,UPDATE_ID,
UPDATE_DT,TRANSFORMER_TYPE,WORKING_DIR,IS_PUBLIC,IS_IMPORT_ONLY,IS_LOCKED,FILTER_MASK,IS_NAMED_LOCATION)
VALUES ('ARTESIA.TRANSFORMER.PROFILE.EXTERNAL_LINK','com.artesia.server.transformer.impl.SendExternalAssetLinkTransformer','N','Y','Y',29,
'External Link Delivery Profile','External Link Delivery Profile','TPackage.sh',10,'TEAMS',NULL,NULL,'MANAGED_DIRECTORY',NULL,'Y','N','N',179,'Y');

INSERT INTO [TRANSFORMER_ATTRIBUTES](LEGACY_TRANSFORMER_ID,TRANSFORMER_ID,ID,NAME,DESCR,DATA_TYPE_ID,OPTION_TYPE_ID,DISPLAY_ID,DEFAULT_VALUE,REQUIRED,ARG_NUM,ARG_OPTION,GUI_NUM,GUI_COMMENTS,MAX_LENGTH)
VALUES
  (29,'ARTESIA.TRANSFORMER.PROFILE.EXTERNAL_LINK',31,'To:','The destination e-mail address. E-mail addresses should be separated with ;(semicolon).',2,4,8,NULL,'Y',2,'@emailto',2,'Please enter the destination e-mail address',1000)
, (29,'ARTESIA.TRANSFORMER.PROFILE.EXTERNAL_LINK',32,'Cc:','The CC e-mail address. E-mail addresses should be separated with ;(semicolon).',2,4,8,NULL,'N',3,'@emailcc',3,NULL,500)
, (29,'ARTESIA.TRANSFORMER.PROFILE.EXTERNAL_LINK',33,'Subject line:','The subject line',2,4,8,'Content sent from Monster Media','Y',4,'@subject',4,NULL,500)
, (29,'ARTESIA.TRANSFORMER.PROFILE.EXTERNAL_LINK',34,'Message body:','The Message body',2,25,8,'Please find the attached content.','Y',5,'@body',5,NULL,2000)
, (29,'ARTESIA.TRANSFORMER.PROFILE.EXTERNAL_LINK',35,'From:','The source e-mail address',2,27,7,'{user.email}','Y',1,'@email',1,NULL,500)
, (29,'ARTESIA.TRANSFORMER.PROFILE.EXTERNAL_LINK',36,'Days Available:','The number of days before the system will clean up the files.',2,4,8,'10','N',6,'@availDays',6,NULL,3)
, (29,'ARTESIA.TRANSFORMER.PROFILE.EXTERNAL_LINK',37,'No. of Hits:','The no. of hits for the link',2,4,8,'15','N',7,'@hits',7,NULL,6)


INSERT INTO [TRANSFORMER_INSTANCES]
           ([TRANSFORMER_INSTANCE_ID]
           ,[TRANSFORMER_ID]
           ,[TYPE]
           ,[NAME]
           ,[DESCRIPTION]
           ,[DEFAULT_FILE_TEMPLATE]
           ,[USER_GROUP_ACCESS_LEVEL])
     VALUES
           ('ARTESIA.TRANSFORMER.PROFILE.EXTERNAL_LINK.DEFAULT'
           ,'ARTESIA.TRANSFORMER.PROFILE.EXTERNAL_LINK'
           ,'DeliveryTemplateEntity'
           ,'External Download Link'
           ,'External Link Delivery Profile'
           , NULL
           ,'allow-all')
GO

UPDATE TRANSFORMER_ATTRIBUTES 
SET OPTION_TYPE_ID='27' 
WHERE TRANSFORMER_ID='ARTESIA.TRANSFORMER.PROFILE.EXTERNAL_LINK' AND ID IN ('31','32')
GO