from __future__ import annotations
import json,re,subprocess

def validate_video(path,expected_duration,check_passed):
 result=subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_type,width,height,r_frame_rate,codec_name','-show_entries','format=duration,size','-of','json',str(path)],text=True)
 data=json.loads(result);video=next((s for s in data['streams'] if s['codec_type']=='video'),None)
 audio=next((s for s in data['streams'] if s['codec_type']=='audio'),None)
 if not video or not audio: raise ValueError('Video and audio streams required')
 fps_num,fps_den=map(int,video['r_frame_rate'].split('/'));fps=fps_num/fps_den
 duration=float(data['format']['duration'])
 if (video['width'],video['height'],fps)!=(1080,1920,30): raise ValueError('Expected 1080x1920 at 30 fps')
 if not 45<=duration<=105 or abs(duration-expected_duration)>.12: raise ValueError('Video duration differs from narration timeline')
 if int(data['format']['size'])<100000: raise ValueError('Video unexpectedly small')
 volume=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-af','volumedetect','-vn','-f','null','-'],capture_output=True,text=True,check=True)
 match=re.search(r'max_volume: (-?[\d.]+) dB',volume.stderr)
 mean=re.search(r'mean_volume: (-?[\d.]+) dB',volume.stderr)
 if not match or not mean: raise ValueError('Unable to measure audio')
 peak=float(match[1]);average=float(mean[1])
 if peak>-.5: raise ValueError('Audio peak too close to clipping')
 if average< -35: raise ValueError('Voice unexpectedly quiet')
 if not check_passed: raise ValueError('HyperFrames check must pass before upload')
 return {'width':1080,'height':1920,'fps':30,'audio':True,'duration':duration,'audio_peak_db':peak,'audio_mean_db':average,'bytes':int(data['format']['size']),'check_passed':True}
