const { exec } = require('child_process');
const process  = require('process');
const si = require('systeminformation');
const cluster = require('cluster');
const http = require('http')
const numCPUs = require('os').cpus().length;
const os = require('os');
const fs = require('fs');


function ReadDateTime() {
     exec('date /t && time /t', (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(stdout);
     });
}
function changeDateTime(){
     const newDate = new Date('2022-04-23 10:30:00');
     const dateString = `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`;
     const timeString = `${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
     exec(`date ${dateString} && time ${timeString}`, (err, stdout, stderr) => {
       if (err) {
         console.error(err);
         return;
       }
       console.log('تاریخ و زمان به روز شد.');
     });
}
async function getMemoryInfo() {
     try {
       const memInfo = await si.mem();
       console.log(`Free memory: ${convertByte(memInfo.free)}`);
     } catch (error) {
       console.error(error);
     }
}
async function getDiskSpaceInfo() {
     try {
          const diskSpaceInfo = await si.fsSize();
          let number = diskSpaceInfo[0].size - diskSpaceInfo[0].used
          console.log(`Free disk space: ${convertByte(number)}`);
     } catch (error) {
          console.error(error);
     }
}
function convertByte(number) {
     let gigabytes = Math.floor(number / 1073741824); // 1 گیگابایت برابر با 1073741824 بایت است
     number %= 1073741824;

     let megabytes = Math.floor(number / 1048576); // 1 مگابایت برابر با 1048576 بایت است
     number %= 1048576;

     let kilobytes = Math.floor(number / 1024); // 1 کیلوبایت برابر با 1024 بایت است
     number %= 1024;

     let bytes = number;

     return gigabytes + 'Gig ' + megabytes + 'MG ' + kilobytes + 'KB ';
}
function startCpuCoreProcess(){
     


     if (cluster.isMaster) {
          // console.log(`Master ${process.pid} is running`);
        
          // Fork workers.
          for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
          }
        
          // Listen for dying workers
          cluster.on('exit', (worker, code, signal) => {
            throw `Worker Number ${worker.process.pid} Died`
          });

     } else {
          // Worker processes have a http server.
          http.createServer((req, res) => {
            res.writeHead(200);
            res.end('hello world\n');
          }).listen(1201);

          console.log(`Worker N.${process.pid} Started`);
     }
   
}
function numOfCpuCore(){
     console.log(numCPUs+' cors')
}
function readUsedTimeOS(){
     const uptimeInSeconds = os.uptime();
     const hours = Math.floor(uptimeInSeconds / 3600); // تعداد ساعت
     const remainingSeconds = uptimeInSeconds % 3600; // باقیمانده ثانیه‌ها
     const minutes = Math.floor(remainingSeconds / 60); // تعداد دقایق
     console.log(`Time of system use by the user: ${hours} Hour ${minutes} Min , ${remainingSeconds} Sec.`);
}
function osInfo(){
     const version = os.release();
     const type = os.type();
     const arch = os.arch();

     // نسخه سیستم عامل
     console.log(`System Version : ${version}`);
     // نوع سیستم عامل
     console.log(`System Type : ${type}`);
     // معماری پردازنده
     console.log(`Processor architecture : ${arch}`);
}
function readFile(){
     fs.readFile(__filename, (err, data) => {
          if (err) throw err;
          console.log(data.toString());
     });
}
function writeFile(){
     fs.writeFile('./test.txt', 'Hello World!', (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
   });
}
function deleteFile(){
     fs.unlink('./test.txt', function (err) {
          if (err) throw err;
          console.log('File deleted successfully!');
        });
}
function orderProcess(){
     // تابعی برای شبیه‌سازی کار هر منبع
     function doTask(taskName, order) {
          console.log(`Task ${taskName} started with order ${order}`);
          let startTime = Date.now();
          while (Date.now() - startTime < 5000); // شبیه‌سازی انجام کار تا ۳ ثانیه
          console.log(`Task ${taskName} finished with order ${order}`);
     }
   
   // تعریف منابع با الویت‌های مختلف
     let resources = [
          { name: 'Resource 1', order: 1 },
          { name: 'Resource 2', order: 2 },
          { name: 'Resource 3', order: 3 },
          { name: 'Resource 4', order: 4 },
          { name: 'Resource 5', order: 5 },
          { name: 'Resource 6', order: 6 },
     ];
   
   // اجرای کار هر منبع با تاخیر متناسب با الویت آن
     for (let i = 0; i < resources.length; i++) {
          let resource = resources[i];
          let delay = resource.order * 1000; // تاخیر متناسب با الویت
          setTimeout(doTask, delay, resource.name, resource.order);
     }
         
}
module.exports = {
     ReadDateTime,
     changeDateTime,
     getMemoryInfo,
     getDiskSpaceInfo,
     startCpuCoreProcess,
     numOfCpuCore,
     readUsedTimeOS,
     osInfo,
     readFile,
     writeFile,
     deleteFile,
     orderProcess,
}