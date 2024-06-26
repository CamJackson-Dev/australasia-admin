import attractionData from './data/output.json'
import { firestore, storage } from "../../../src/config/firebase";


const AttractionUpload = () => {
  
  
  const uploadImgaes = async() => {
    const imageUrls = {}

    await Promise.all(
      Object.keys(attractionData).map(async (territory) => {
        if (!(territory in imageUrls)) imageUrls[territory] = {}
        
        const territoryData = attractionData[territory]
        Object.keys(territoryData).map(async (city) => {
          if (!(city in imageUrls[territory])) imageUrls[territory][city] = {"man-made": {}, "natural-wonders": {}}
          const cityData = territoryData[city]
  
          const manMade = cityData["man-made"]
          const naturalWonders = cityData["natural-wonders"]
  
          // console.log(manMade, city, "MMMMM")
          // console.log(naturalWonders, city, "NNNN")

          // ---------------- man made ---------------
          Object.keys(manMade).map(async (manmades) => {
            if (!(manmades in imageUrls[territory][city]["man-made"])) imageUrls[territory][city]["man-made"][manmades] = []
            
            const manMadeData = manMade[manmades]
            let thisArray = imageUrls[territory][city]["man-made"][manmades]
            await Promise.all(
              Object.values(manMadeData).map(async (eachData) => {
                const fileUrl = eachData[0].path
                const fileName = eachData[0].filename
    
                // thisArray.push(fileName)
                // console.log(fileName)
                // const res = await fetch(fileUrl)

                //-------------------------------------
                const fileBlob = await new Promise((resolve, reject) => {
                  fetch(fileUrl)
                    .then(response => response.blob())
                    .then(blob => resolve(blob))
                    .catch(error => reject(error));
                });
                //-------------------------------------

                // console.log(fileName, fileBlob)

                //-------------------------------------
                const storageRef = storage.ref()     
                let uploadRef = await storageRef
                    .child(`attractions/${territory}/${city}/man-made/${manmades}/${fileName}`)
                    .put(fileBlob);
                    
                await uploadRef.ref.getDownloadURL().then((url) => {
                  thisArray.push(url)
                  console.log(url)
                })
              })
            ).then(() => console.log("final", imageUrls))
          })

          // ---------------- natural ---------------
          Object.keys(naturalWonders).map(async (naturals) => {
            if (!(naturals in imageUrls[territory][city]["natural-wonders"])) imageUrls[territory][city]["natural-wonders"][naturals] = []
            
            const naturalData = naturalWonders[naturals]
            let thisArray = imageUrls[territory][city]["natural-wonders"][naturals]
            await Promise.all(
              Object.values(naturalData).map(async (eachData) => {
                const fileUrl = eachData[0].path
                const fileName = eachData[0].filename
    
                // thisArray.push(fileName)
                // const res = await (await fetch(fileUrl)).blob()
                // console.log(res)

                //-------------------------------------
                const fileBlob = await new Promise((resolve, reject) => {
                  fetch(fileUrl)
                    .then(response => response.blob())
                    .then(blob => resolve(blob))
                    .catch(error => reject(error));
                });
                //-------------------------------------

                // console.log(fileName, fileBlob)

                //-------------------------------------
                const storageRef = storage.ref()     
                let uploadRef = await storageRef
                    .child(`attractions/${territory}/${city}/natural-wonders/${naturals}/${fileName}`)
                    .put(fileBlob);
                    
                await uploadRef.ref.getDownloadURL().then((url) => {
                  thisArray.push(url)
                  console.log(url)
                })
              })
            ).then(() => console.log("final", imageUrls))
          })


        })
      })
    )
    // console.log(imageUrls)
  }
  
  return ( 
    <div style={{height: '80vh', width: '80vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <button style={{padding: '10px 20px'}} onClick={uploadImgaes}>Upload</button>
    </div>
  );
}
 
export default AttractionUpload;