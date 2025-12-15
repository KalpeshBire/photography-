const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        // Create a dummy valid PNG file (1x1 pixel)
        const filePath = path.join(__dirname, 'test-image.png');
        const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKwjwAAAAABJRU5ErkJggg==";
        fs.writeFileSync(filePath, Buffer.from(pngBase64, 'base64'));

        // Login first to get cookie
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@example.com',
            password: 'newpassword123'
        });
        
        const cookie = loginRes.headers['set-cookie'];
        console.log('✅ Login successful');

        // Prepare upload
        const form = new FormData();
        form.append('name', 'Test Service');
        form.append('serviceType', 'Photography');
        form.append('description', 'Test Description');
        form.append('pricing_type', 'per event');
        form.append('pricing_basePrice', '1000');
        form.append('active', 'true');
        form.append('image', fs.createReadStream(filePath), 'test.png');

        // Upload to Service
        const uploadRes = await axios.post('http://localhost:5000/api/admin/services/create', form, {
            headers: {
                ...form.getHeaders(),
                Cookie: cookie
            }
        });

        console.log('✅ Upload response:', uploadRes.data);
        console.log('✅ Image URL:', uploadRes.data.image.url);

        if (uploadRes.data.image.url.includes('cloudinary')) {
            console.log('🎉 SUCCESS: Image uploaded to Cloudinary!');
        } else {
            console.log('⚠️ WARNING: Image uploaded locally (Fallback active).');
        }

        // Cleanup
        fs.unlinkSync(filePath);

    } catch (error) {
        if (error.response) {
            console.error('❌ Upload failed:', error.response.status, error.response.data);
        } else {
            console.error('❌ Upload failed:', error.stack || error.message);
        }
    }
}

testUpload();
