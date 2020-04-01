let db; 
        const nim=document.getElementById("nim");
        const nama=document.getElementById("nama");
        const prodi=document.getElementById("prodi");
        const email=document.getElementById("email");
        const daftar= document.getElementById("daftar");
        const view=document.getElementById("view");
        const tbody=document.getElementById("tbody");
        
        daftar.addEventListener("click" , viewDB);
        tbody.addEventListener("click", deleteBaris, true);

        function resetData(){
           nim.value="";
           nama.value=" ";
           prodi.value="";
           email.value="";
        }

        function deleteFromDB(nim){
            const tx=db.transaction("Informatika","readwrite").objectStore("Informatika");
            const request=tx.delete(nim)
            
            request.onsuccess = e =>{
                alert("Data berhasil dihapus")

            }
            request.onerror= e =>{
                alert("data gagal dihapus")
            }        
        }

        function deleteBaris(e){
           if (e.target.type=='button') {
            tbody.deleteRow(tbody.rows.namedItem(e.target.id).sectionRowIndex);
            deleteFromDB(e.target.id);
           }     
        }

        function viewDB(){
            addDB();
            resetData();
            while(tbody.firstChild){
                tbody.removeChild(tbody.firstChild);
            }
            const tx=db.transaction("Informatika", "readwrite");
            const mhs=tx.objectStore("Informatika");
            const request=mhs.openCursor();
            request.onsuccess = e => {
               
                const result=e.target.result;
                if (result){
                    let baris = tbody.insertRow();
                    baris.id = result.value.nim;
                    baris.insertCell().appendChild(document.createTextNode(result.value.nim));
                    baris.insertCell().appendChild(document.createTextNode(result.value.nama));
                    baris.insertCell().appendChild(document.createTextNode(result.value.prodi));
                    baris.insertCell().appendChild(document.createTextNode(result.value.email));
                    var btnHapus = document.createElement('input');
                    btnHapus.type = 'button';
                    btnHapus.value = 'Hapus';
                    btnHapus.id = baris.id;         
                    baris.insertCell().appendChild(btnHapus);
                    result.continue();
                }
            }
        }

        function addDB(){
            const Mahasiswa={
                nim:nim.value,
                nama:nama.value,
                prodi:prodi.value,
                email:email.value
            }
            const tx= db.transaction("Informatika", "readwrite");
            const mhs=tx.objectStore("Informatika");
            mhs.add(Mahasiswa);
           
        }
        
        function createDB(){
            const request = indexedDB.open("DB_Mahasiswa")
            request.onupgradeneeded = e =>{
            db=e.target.result;

            db.createObjectStore("Informatika",{keyPath:"nim", autoIncrement:false})
        }

            request.onsuccess = e =>{
                alert("Database berhasil dibuat") 
            }
            request.onerror= e =>{
                alert("error")
            }
        }
        createDB()