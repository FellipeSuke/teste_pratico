/*


    Para sua livre contemplação @@


*/

ALTER TABLE DEV.PESSOAS
 DROP PRIMARY KEY CASCADE;

DROP TABLE DEV.PESSOAS CASCADE CONSTRAINTS;

CREATE TABLE DEV.PESSOAS
(
  COD_PESSOA       INTEGER,
  NOME             VARCHAR2(200 BYTE)           NOT NULL,
  CPF              VARCHAR2(11 BYTE)            NOT NULL,
  RG               VARCHAR2(15 BYTE)            NOT NULL,
  TELEFONE         VARCHAR2(20 BYTE),
  EMAIL            VARCHAR2(200 BYTE),
  SEXO             VARCHAR2(1 BYTE)             NOT NULL,
  DATA_NASCIMENTO  DATE                         NOT NULL
)
TABLESPACE USERS
RESULT_CACHE (MODE DEFAULT)
PCTUSED    0
PCTFREE    10
INITRANS   1
MAXTRANS   255
STORAGE    (
            INITIAL          64K
            NEXT             1M
            MINEXTENTS       1
            MAXEXTENTS       UNLIMITED
            PCTINCREASE      0
            BUFFER_POOL      DEFAULT
            FLASH_CACHE      DEFAULT
            CELL_FLASH_CACHE DEFAULT
           )
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;


CREATE UNIQUE INDEX DEV.PESSOAS_PK ON DEV.PESSOAS
(COD_PESSOA)
LOGGING
TABLESPACE USERS
PCTFREE    10
INITRANS   2
MAXTRANS   255
STORAGE    (
            INITIAL          64K
            NEXT             1M
            MINEXTENTS       1
            MAXEXTENTS       UNLIMITED
            PCTINCREASE      0
            BUFFER_POOL      DEFAULT
            FLASH_CACHE      DEFAULT
            CELL_FLASH_CACHE DEFAULT
           )
NOPARALLEL;


--DROP SEQUENCE DEV.PESSOAS2_SEQ;

CREATE SEQUENCE DEV.PESSOAS2_SEQ
  START WITH 1
  MAXVALUE 999999999999999999999999999
  MINVALUE 1
  NOCYCLE
  NOCACHE
  NOORDER;

CREATE OR REPLACE TRIGGER DEV.PESSOAS_TRG
BEFORE INSERT
ON DEV.PESSOAS
REFERENCING NEW AS New OLD AS Old
FOR EACH ROW
BEGIN
-- For Toad:  Highlight column COD_PESSOA
  :new.COD_PESSOA := DEV.PESSOAS2_SEQ.nextval;
END PESSOAS_TRG;
/


ALTER TABLE DEV.PESSOAS ADD (
  CONSTRAINT PESSOAS_PK
  PRIMARY KEY
  (COD_PESSOA)
  USING INDEX DEV.PESSOAS_PK
  ENABLE VALIDATE);
