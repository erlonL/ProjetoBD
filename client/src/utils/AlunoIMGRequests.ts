const Image = async (matricula: string) => {
    try {
        console.log(`Requesting ${matricula} image...`);
        const response = await fetch(`/api/image/${matricula}`);
        if (!response.ok) {
            throw new Error('Network response was not ok'); 
        }
        const data = await response.json();
        console.log(data);
        return data;
    }catch(e){
        console.error('There has been a problem with your fetch operation:', e);
        return;
    } finally {
        console.log('Aluno Image Request Successful');
    }
  }

const Create = async (matricula: string, imgURL: string) => {
    try {
        console.log(`Requesting image creation for ${matricula}...`);
        const response = await fetch('/api/createImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ matricula, url: imgURL })
            });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseJSON = await response.json();
        return responseJSON;
    }catch(e){
        console.error('There has been a problem with your fetch operation:', e);
        return;
    }finally{
        console.log('Image created successfully');
    }
}

const Delete = async (matricula: string) => {
    try {
        console.log(`Requesting image deletion for ${matricula}...`);
        const response = await fetch(`/api/deleteImage?matricula=${matricula}`, {
        method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseJSON = await response.json();
        console.log(responseJSON);
        return responseJSON;
    }catch(e){
        console.error('There has been a problem with your fetch operation:', e);
        return;
    } finally {
        console.log('Image deleted successfully');
    }
}

const Update = async (matricula: string, url: string) => {
    try {
        console.log(`Requesting image update for ${matricula}...`);
        const response = await fetch('/api/updateImage', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matricula, url })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseJSON = await response.json();
        console.log(responseJSON);
        return responseJSON;
    }catch(e){
        console.error('There has been a problem with your fetch operation:', e);
        return;
    } finally {
        console.log('Image updated successfully');
    }
}

const AlunoIMG = {
    Image,
    Create,
    Delete,
    Update
}

export default AlunoIMG;