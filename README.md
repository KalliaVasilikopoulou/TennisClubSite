# advancedProgrammingTechniques

Εφαρμογή Tennis Club

Περιγραφή 

Εφαρμογή Tennis Club. 
Χρησιμοποιεί Node.js με CommonJS moduling και PostgreSQL database. 
Για installation θα πρέπει να δημιουργηθεί τοπικά database σύμφωνα με το αρχείο make_new_database.sql που περιλαμβάνεται στον φάκελο data. Θα πρέπει επίσης να δημιουργηθεί αρχείο .env με τα στοιχεία του database. Στη συνέχεια αρκεί ένα npm install και npm run watch για χρήση του προγράμματος. 

Περιεχόμενα αρχείου .env : 

//στοιχεια database 
PG_HOST= 
PG_PORT= 
PG_USER= 
PG_PASSWORD= 
PG_DATABASE= 

//στοιχεία session που επιλέγονται από το χρήστη
SESSION_SECRET = 
SESSION_NAME = 



Σε περίπτωση που χρειαστεί να τρέξει ένας χρήστης το unit test, πρέπει πρώτα να διαβάσει και να ακολουθήσει όλα τα σχόλια που υπάρχουν μέσα στο αρχείο του unit test.

Συγκεκριμένα, πρέπει προηγουμένως:
 - να αφαιρέσει όλες τις κρατήσεις γηπέδων από την βάση,
 - να σβήσει όλα τα τουρνουά, εκτός από ένα, στο οποίο θα δώσει τιμή του tournamentid = 'TOUR_3_26' και μία αυθαίρετη τιμή στο title (το title δεν μπορεί να είναι null),
 - να κάνει uncomment την γραμμή 113 στο αρχείο model_pg.cjs (σε περίπτωση που για κάποιο λόγο μετακινήθηκε η γραμμή, ο χρήστης πρέπει να ψάξει την γραμμή με την εντολή  if (userid == null) {userid=2}  και να την κάνει uncomment),
 - να θέσει στο test για την διαγραφή μήνα το όνομα του ισχίοντος μήνα στα αγγλικά (με κεφαλαίο το πρώτο γράμμα) μέσα στο unit test.

 Αφού ολοκληρώσει τα παραπάνω, ο χρήστης μπορεί να τρέξει το unit test μέσω της εντολής  $ run test.
 
 ------
 late updates to main branch for heroky deployment (final app is in release branch)
 
 
 
 ------
 heroku deployment succesful
 
 heroku link:
 https://tennis-club-site.herokuapp.com/
 
admin account examole:
username: kallia
password: kallia
