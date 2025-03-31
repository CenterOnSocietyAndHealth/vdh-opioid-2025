import { NextResponse } from 'next/server';
import { serverClient } from '@/sanity/lib/server';

export async function POST(request: Request) {
  try {
    const { pageId, localityId } = await request.json();

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    console.log('Updating locality:', { pageId, localityId });

    // First verify the page exists
    const page = await serverClient.fetch(`*[_id == $pageId][0]`, { pageId });
    if (!page) {
      console.error('Page not found:', pageId);
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Only verify locality exists if localityId is provided and not null
    if (localityId && localityId !== "State") {
      const locality = await serverClient.fetch(`*[_id == $localityId][0]`, { localityId });
      if (!locality) {
        console.error('Locality not found:', localityId);
        return NextResponse.json({ error: 'Locality not found' }, { status: 404 });
      }
    }

    // Create the patch operation
    const patch = serverClient.patch(pageId);

    // Set the selectedLocality field
    if (localityId && localityId !== "State") {
      patch.set({
        selectedLocality: {
          _type: 'reference',
          _ref: localityId
        }
      });
    } else {
      patch.set({
        selectedLocality: null
      });
    }

    // Commit the changes
    try {
      const result = await patch.commit();
      console.log('Update successful:', result);
      return NextResponse.json({ success: true, result });
    } catch (commitError: any) {
      console.error('Commit error:', {
        message: commitError.message,
        details: commitError.details,
        stack: commitError.stack,
        statusCode: commitError.statusCode
      });
      
      // Check if it's a permissions error
      if (commitError.statusCode === 403) {
        return NextResponse.json({ 
          error: 'Permission denied. Please check your API token permissions.',
          details: commitError.message
        }, { status: 403 });
      }

      return NextResponse.json({ 
        error: 'Failed to commit changes',
        details: commitError.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error updating locality:', {
      message: error.message,
      stack: error.stack,
      details: error.details,
      statusCode: error.statusCode
    });
    
    // Check if it's a permissions error
    if (error.statusCode === 403) {
      return NextResponse.json({ 
        error: 'Permission denied. Please check your API token permissions.',
        details: error.message
      }, { status: 403 });
    }

    return NextResponse.json({ 
      error: 'Failed to update locality',
      details: error.message
    }, { status: 500 });
  }
} 